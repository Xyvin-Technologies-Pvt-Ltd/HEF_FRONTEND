import {
  Box,
  Grid,
  Typography,
  Stack,
  LinearProgress,
  FormHelperText,
  Button,
  debounce,
} from "@mui/material";
import React, { useCallback, useEffect, useState } from "react";
import { Controller, useFieldArray, useForm } from "react-hook-form";
import StyledInput from "../../ui/StyledInput";
import StyledSelectField from "../../ui/StyledSelectField";
import { StyledMultilineTextField } from "../../ui/StyledMultilineTextField";
import { StyledButton } from "../../ui/StyledButton";
import { StyledEventUpload } from "../../ui/StyledEventUpload";
import { toast } from "react-toastify";
import { useLocation, useNavigate } from "react-router-dom";
import { useMemberStore } from "../../store/Memberstore";
import { getLevels, getAllLevel } from "../../api/hierarchyapi";
import { Delete } from "@mui/icons-material";
import { getTags } from "../../api/memberapi";
import StyledSearchInputField from "../../ui/StyledSearchInputField";
import { StyledCalender } from "../../ui/StyledCalender";
import { upload } from "../../api/adminapi";

const AddMember = () => {
  const {
    control,
    handleSubmit,
    reset,
    setValue,
    formState: { errors },
  } = useForm();
  const navigate = useNavigate();
  const location = useLocation();
  const { memberId, isUpdate } = location.state || {};

  const { addMembers, fetchMemberById, member, updateMember, loading } =
    useMemberStore();
  const [loadings, setLoadings] = useState(false);
  const [imageFile, setImageFile] = useState(null);
  const [additionalPhones, setAdditionalPhones] = useState([]);
  const [addMoreDisabled, setAddMoreDisabled] = useState(false);
  const [stateOptions, setStateOptions] = useState([]);
  const [zoneOptions, setZoneOptions] = useState([]);
  const [districtOptions, setDistrictOptions] = useState([]);
  const [chapterOptions, setChapterOptions] = useState([]);
  const [selectedZone, setSelectedZone] = useState("");
  const [selectedDistrict, setSelectedDistrict] = useState("");
  const [options, setOptions] = useState([]);
  const [inputValue, setInputValue] = useState("");
  useEffect(() => {
    if (isUpdate && memberId) {
      fetchMemberById(memberId);
    }
  }, [memberId, isUpdate]);

  useEffect(() => {
    const setFormValues = async () => {
      if (isUpdate && member) {
        setValue("name", member?.name || "");
        setValue("email", member?.email || "");
        setValue("phone", member?.phone || "");
        setValue("bio", member?.bio || "");
        setValue("image", member?.image || "");
        setValue("address", member?.address || "");
        setValue("whatsapp", member?.secondaryPhone?.whatsapp);
        setValue("business", member?.secondaryPhone?.business);
        setValue("designation", member?.designation || "");
        setValue("dateOfJoining", member?.dateOfJoining || "");
        if (member?.secondaryPhone?.whatsapp) {
          setAdditionalPhones([{ name: "WhatsApp Number", key: "whatsapp" }]);
        }
        if (member?.secondaryPhone?.business) {
          setAdditionalPhones((prev) => [
            ...prev,
            { name: "Business Number", key: "business" },
          ]);
        }
        if (Array.isArray(member?.company)) {
          const companies = member.company.map((company, index) => ({
            name: company?.name || "",
            phone: company?.phone || "",
            email: company?.email || "",
            designation: company?.designation || "",
            websites: company?.websites || "",
          }));
          setValue("companies", companies);
        }

        setValue("businessCatogary", member?.businessCatogary);

        setValue("businessSubCatogary", member?.businessSubCatogary);
        const selectedStatus = statusOptions?.find(
          (item) => item?.value === member?.status
        );
        setValue("status", selectedStatus || "");
        const selectedState = stateOptions?.find(
          (option) => option?.value === member?.state?._id
        );
        setValue("state", selectedState || "");
        if (Array.isArray(member?.businessTags) && member.businessTags.length) {
          const businessTags = member.businessTags.map((tag) => ({
            label: tag,
            value: tag,
          }));
          setValue("businessTags", businessTags);
        }
        if (selectedState) {
          const zones = await fetchData("state", selectedState.value);
          const formattedZones = zones.map(({ _id, name }) => ({
            value: _id,
            label: name,
          }));
          setZoneOptions(formattedZones);

          const selectedZone = formattedZones.find(
            (zone) => zone.value === member?.zone?._id
          );
          setValue("zone", selectedZone || "");

          if (selectedZone) {
            const districts = await fetchData("zone", selectedZone.value);
            const formattedDistricts = districts.map(({ _id, name }) => ({
              value: _id,
              label: name,
            }));
            setDistrictOptions(formattedDistricts);

            const selectedDistrict = formattedDistricts.find(
              (district) => district.value === member?.district?._id
            );
            setValue("district", selectedDistrict || "");

            if (selectedDistrict) {
              const chapters = await fetchData(
                "district",
                selectedDistrict.value
              );
              const formattedChapters = chapters.map(({ _id, name }) => ({
                value: _id,
                label: name,
              }));
              setChapterOptions(formattedChapters);

              const selectedChapter = formattedChapters.find(
                (chapter) => chapter.value === member?.chapter?._id
              );
              setValue("chapter", selectedChapter || "");
            }
          }
        }
      }
    };
    setFormValues();
  }, [member, isUpdate, setValue]);
  const addPhoneNumber = () => {
    setAdditionalPhones((prevPhones) => {
      const newPhones = [...prevPhones];

      if (newPhones.length === 0) {
        newPhones.push({ name: "WhatsApp Number", key: "whatsapp" });
      } else if (newPhones.length === 1) {
        newPhones.push({
          name: "Business Number",
          key: "business",
        });
      }

      if (newPhones.length === 2) {
        setAddMoreDisabled(true);
      }

      return newPhones;
    });
  };

  const statusOptions = [
    { value: "active", label: "Active" },
    { value: "inactive", label: "Inactive" },
  ];

  const handleClear = (event) => {
    event.preventDefault();
    reset();
    setImageFile(null);
    navigate(-1);
  };

  const onSubmit = async (data) => {
    try {
      setLoadings(true);
      let imageUrl = data?.image || "";
      if (imageFile) {
        try {
          imageUrl = await new Promise(async (resolve, reject) => {
            try {
              const response = await upload(imageFile);
              resolve(response?.data || "");
            } catch (error) {
              reject(error);
            }
          });
        } catch (error) {
          console.error("Failed to upload image:", error);
          return;
        }
      }
      const filteredCompanies = data?.companies
        ?.map((company) => {
          const cleanedCompany = Object.fromEntries(
            Object.entries(company).filter(([_, value]) => value?.trim()) // Remove empty values
          );
          return Object.keys(cleanedCompany).length ? cleanedCompany : null; // Keep only non-empty objects
        })
        .filter(Boolean); // Remove null entries

      const formData = {
        name: data?.name,
        ...(data?.email && { email: data?.email }),
        ...(data?.designation && { designation: data?.designation }),
        phone: data?.phone?.startsWith("+") ? data.phone : `+${data.phone}`,
        ...(data?.whatsapp || data?.business
          ? {
              secondaryPhone: {
                whatsapp: data?.whatsapp,
                business: data?.business,
              },
            }
          : {}),
        status: data?.status.value,
        ...(data?.bio && { bio: data?.bio }),
        ...(data?.address && { address: data?.address }),
        ...(imageUrl && { image: imageUrl }),
        ...(data?.dateOfJoining && { dateOfJoining: data?.dateOfJoining }),
        ...(filteredCompanies?.length ? { company: filteredCompanies } : {}),
        businessCatogary: data?.businessCatogary,
        businessSubCatogary: data?.businessSubCatogary,
        chapter: data?.chapter?.value,
        ...(Array.isArray(data?.businessTags) && data?.businessTags.length
          ? { businessTags: data.businessTags.map((tag) => tag?.value || tag) }
          : {}),
      };
      if (isUpdate) {
        await updateMember(memberId, formData);
      } else {
        await addMembers(formData);
      }
      reset();
      navigate("/members");
    } catch (error) {
      toast.error(error.message);
    } finally {
      setLoadings(false);
    }
  };
  const fetchData = async (type, id) => {
    try {
      const response = await getLevels(id, type);

      return response.data;
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };
  useEffect(() => {
    const fetchStates = async () => {
      try {
        const stateData = await getAllLevel("state");
        const formattedOptions = stateData?.data?.map((state) => ({
          value: state?._id,
          label: state?.name,
        }));
        setStateOptions(formattedOptions);
      } catch (error) {
        console.error("Error fetching admin data:", error);
      }
    };

    fetchStates();
  }, []);
  const handleStateChange = async (stateId) => {
    setZoneOptions([]);
    setDistrictOptions([]);
    setChapterOptions([]);
    const zones = await fetchData("state", stateId.value);
    setZoneOptions(zones.map(({ _id, name }) => ({ value: _id, label: name })));
  };

  const handleZoneChange = async (zoneId) => {
    setSelectedZone(zoneId);
    setDistrictOptions([]);
    setChapterOptions([]);
    const districts = await fetchData("zone", zoneId);
    setDistrictOptions(
      districts.map(({ _id, name }) => ({ value: _id, label: name }))
    );
  };
  const handleDistrictChange = async (districtId) => {
    setSelectedDistrict(districtId);
    setChapterOptions([]);
    const chapters = await fetchData("district", districtId);
    setChapterOptions(
      chapters.map(({ _id, name }) => ({ value: _id, label: name }))
    );
  };
  const { fields, append, remove } = useFieldArray({
    control,
    name: "companies",
  });
  const fetchTags = async (input) => {
    const response = await getTags({ search: input });
    const data = response.data;
    if (data) {
      setOptions(data.map((tag) => ({ label: tag, value: tag })));
    }
  };
  const debouncedFetchTags = useCallback(
    debounce((input) => fetchTags(input), 300),
    []
  );

  useEffect(() => {
    if (inputValue) {
      debouncedFetchTags(inputValue);
    }
  }, [inputValue, debouncedFetchTags]);
  return (
    <>
      {loading ? (
        <LinearProgress />
      ) : (
        <Box
          sx={{ padding: 3 }}
          bgcolor={"white"}
          borderRadius={"12px"}
          border={"1px solid rgba(0, 0, 0, 0.12)"}
        >
          <form onSubmit={handleSubmit(onSubmit)}>
            <Grid container spacing={4}>
              <Grid item xs={12}>
                <Typography
                  sx={{ marginBottom: 1 }}
                  variant="h6"
                  color="textSecondary"
                >
                  Full Name <span style={{ color: "red" }}>*</span>
                </Typography>
                <Controller
                  name="name"
                  control={control}
                  defaultValue=""
                  rules={{ required: "Full Name is required" }}
                  render={({ field }) => (
                    <>
                      <StyledInput
                        placeholder="Enter the Full name"
                        {...field}
                      />
                      {errors.name && (
                        <span style={{ color: "red" }}>
                          {errors.name.message}
                        </span>
                      )}
                    </>
                  )}
                />
              </Grid>
              <Grid item xs={6}>
                <Typography
                  sx={{ marginBottom: 1 }}
                  variant="h6"
                  color="textSecondary"
                >
                  Photo
                </Typography>
                <Controller
                  name="image"
                  control={control}
                  defaultValue=""
                  render={({ field: { onChange, value } }) => (
                    <>
                      <StyledEventUpload
                        label="Upload Photo here"
                        onChange={(file) => {
                          setImageFile(file);
                          onChange(file);
                        }}
                        value={value}
                      />
                      <FormHelperText style={{ color: "#888" }}>
                        File size limit: 1 MB
                      </FormHelperText>
                    </>
                  )}
                />
              </Grid>
              <Grid item xs={6}>
                <Typography
                  sx={{ marginBottom: 1 }}
                  variant="h6"
                  color="textSecondary"
                >
                  Email Id
                </Typography>
                <Controller
                  name="email"
                  control={control}
                  defaultValue=""
                  render={({ field }) => (
                    <>
                      <StyledInput
                        placeholder="Enter the email id "
                        {...field}
                      />
                    </>
                  )}
                />
              </Grid>
              <Grid item xs={12}>
                <Typography
                  sx={{ marginBottom: 1 }}
                  variant="h6"
                  color="textSecondary"
                >
                  Phone number <span style={{ color: "red" }}>*</span>
                </Typography>
                <Controller
                  name="phone"
                  control={control}
                  defaultValue=""
                  rules={{ required: "Phone number is required" }}
                  render={({ field }) => (
                    <>
                      <StyledInput
                        type={"mobile"}
                        placeholder="Enter number with country code & without space in between the numbers"
                        {...field}
                      />
                      {errors.phone && (
                        <span style={{ color: "red" }}>
                          {errors.phone.message}
                        </span>
                      )}
                    </>
                  )}
                />{" "}
                {additionalPhones.map((phone) => (
                  <Grid marginTop={2} key={phone.key}>
                    <Controller
                      name={phone.key}
                      control={control}
                      defaultValue=""
                      render={({ field }) => (
                        <>
                          <StyledInput
                            placeholder={`Enter ${phone.name.toLowerCase()}`}
                            {...field}
                          />
                        </>
                      )}
                    />
                  </Grid>
                ))}
                <Typography
                  onClick={addPhoneNumber}
                  display={addMoreDisabled ? "none" : ""}
                  sx={{
                    color: "#004797",
                    cursor: addMoreDisabled ? "default" : "pointer",
                    marginTop: 1,
                    fontSize: "0.9rem",
                    textDecoration: addMoreDisabled ? "line-through" : "none",
                  }}
                >
                  + Add more
                </Typography>
              </Grid>{" "}
              <Grid item xs={12}>
                <Typography
                  sx={{ marginBottom: 1 }}
                  variant="h6"
                  color="textSecondary"
                >
                  Designation
                </Typography>
                <Controller
                  name="designation"
                  control={control}
                  defaultValue=""
                  render={({ field }) => (
                    <>
                      <StyledInput
                        placeholder="Enter the Designation"
                        {...field}
                      />
                    </>
                  )}
                />
              </Grid>
              <Grid item xs={12}>
                <Typography
                  sx={{ marginBottom: 1 }}
                  variant="h6"
                  color="textSecondary"
                >
                  Bio
                </Typography>
                <Controller
                  name="bio"
                  control={control}
                  defaultValue=""
                  render={({ field }) => (
                    <>
                      <StyledMultilineTextField placeholder="Bio" {...field} />
                    </>
                  )}
                />
              </Grid>
              <Grid item xs={12}>
                <Typography
                  sx={{ marginBottom: 1 }}
                  variant="h6"
                  color="textSecondary"
                >
                  Personal Address
                </Typography>
                <Controller
                  name="address"
                  control={control}
                  defaultValue=""
                  render={({ field }) => (
                    <>
                      <StyledInput
                        placeholder="Enter the Personal Address"
                        {...field}
                      />
                    </>
                  )}
                />
              </Grid>{" "}
              <Grid item xs={6}>
                {" "}
                <Typography
                  sx={{ marginBottom: 1 }}
                  variant="h6"
                  color="textSecondary"
                >
                  Company Details
                </Typography>
              </Grid>
              <Grid item xs={6} display={"flex"} justifyContent={"flex-end"}>
                <Typography
                  sx={{
                    color: "#004797",
                    marginTop: 1,
                    fontSize: "0.9rem",
                  }}
                  onClick={() =>
                    append({
                      name: "",
                      phone: "",
                      email: "",
                      websites: "",
                    })
                  }
                >
                  +Add Company
                </Typography>
              </Grid>
              {fields?.map((company, index) => (
                <React.Fragment key={company?.id}>
                  <Grid item xs={6}>
                    <Typography variant="h6" color="textSecondary">
                      Company Name
                    </Typography>
                    <Controller
                      name={`companies[${index}].name`}
                      control={control}
                      defaultValue={company.name}
                      render={({ field }) => (
                        <StyledInput
                          placeholder="Enter company name"
                          {...field}
                        />
                      )}
                    />
                  </Grid>
                  <Grid item xs={6}>
                    <Typography variant="h6" color="textSecondary">
                      Company Phone
                    </Typography>
                    <Controller
                      name={`companies[${index}].phone`}
                      control={control}
                      defaultValue={company.phone}
                      render={({ field }) => (
                        <StyledInput
                          placeholder="Enter company phone"
                          {...field}
                        />
                      )}
                    />
                  </Grid>
                  <Grid item xs={6}>
                    <Typography variant="h6" color="textSecondary">
                      Company Designation
                    </Typography>
                    <Controller
                      name={`companies[${index}].designation`}
                      control={control}
                      defaultValue={company.designation}
                      render={({ field }) => (
                        <StyledInput
                          placeholder="Enter company designation"
                          {...field}
                        />
                      )}
                    />
                  </Grid>
                  <Grid item xs={6}>
                    <Typography variant="h6" color="textSecondary">
                      Company Email
                    </Typography>
                    <Controller
                      name={`companies[${index}].email`}
                      control={control}
                      defaultValue={company.email}
                      render={({ field }) => (
                        <StyledInput
                          placeholder="Enter company email"
                          {...field}
                        />
                      )}
                    />
                  </Grid>
                  <Grid item xs={6}>
                    <Typography variant="h6" color="textSecondary">
                      Website
                    </Typography>
                    <Controller
                      name={`companies[${index}].websites`}
                      control={control}
                      defaultValue={company.websites}
                      render={({ field }) => (
                        <StyledInput placeholder="Enter website" {...field} />
                      )}
                    />
                  </Grid>

                  <Grid item xs={12}>
                    <Typography
                      onClick={() => remove(index)}
                      sx={{
                        color: "#004797",
                        marginTop: 1,
                        fontSize: "0.9rem",
                      }}
                    >
                      <Delete />
                    </Typography>
                  </Grid>
                </React.Fragment>
              ))}
              <Grid
                item
                xs={12}
                display={"flex"}
                alignItems={"flex-end"}
                justifyContent={"flex-end"}
              ></Grid>
              <Grid item xs={12}>
                <Typography
                  sx={{ marginBottom: 1 }}
                  variant="h6"
                  color="textSecondary"
                >
                  Business Category <span style={{ color: "red" }}>*</span>
                </Typography>
                <Controller
                  name="businessCatogary"
                  control={control}
                  rules={{ required: "Business category is required" }}
                  defaultValue=""
                  render={({ field }) => (
                    <>
                      <StyledInput
                        placeholder="Enter business category"
                        {...field}
                      />
                      {errors.businessCatogary && (
                        <span style={{ color: "red" }}>
                          {errors.businessCatogary.message}
                        </span>
                      )}
                    </>
                  )}
                />
              </Grid>
              <Grid item xs={12}>
                <Typography
                  sx={{ marginBottom: 1 }}
                  variant="h6"
                  color="textSecondary"
                >
                  Subcategory <span style={{ color: "red" }}>*</span>
                </Typography>
                <Controller
                  name="businessSubCatogary"
                  control={control}
                  defaultValue=""
                  rules={{ required: "Subcategory is required" }}
                  render={({ field }) => (
                    <>
                      <StyledInput placeholder="Enter subcategory" {...field} />
                      {errors.businessSubCatogary && (
                        <span style={{ color: "red" }}>
                          {errors.businessSubCatogary.message}
                        </span>
                      )}
                    </>
                  )}
                />
              </Grid>{" "}
              <Grid item xs={12}>
                <Typography
                  sx={{ marginBottom: 1 }}
                  variant="h6"
                  color="textSecondary"
                >
                  Date of Joining
                </Typography>
                <Controller
                  name="dateOfJoining"
                  control={control}
                  defaultValue={null}
                  // rules={{ required: "Start Date is required" }}
                  render={({ field }) => (
                    <>
                      <StyledCalender {...field} />
                    </>
                  )}
                />
              </Grid>
              <Grid item xs={12}>
                <Typography
                  sx={{ marginBottom: 1 }}
                  variant="h6"
                  color="textSecondary"
                >
                  Business Tags
                </Typography>
                <Controller
                  name="businessTags"
                  control={control}
                  defaultValue={[]}
                  render={({ field }) => (
                    <StyledSearchInputField
                      {...field}
                      isMulti
                      placeholder="Enter tags"
                      options={
                        inputValue &&
                        !options.some((option) => option?.label === inputValue)
                          ? [
                              ...options,
                              { label: inputValue, value: inputValue },
                            ]
                          : options
                      }
                      onInputChange={(value) => setInputValue(value)}
                      onChange={(selected) => {
                        if (selected?.length > 0) {
                          const lastTag = selected[selected.length - 1];
                          if (
                            !options.some(
                              (option) => option.value === lastTag.value
                            )
                          ) {
                            setOptions((prevOptions) => [
                              ...prevOptions,
                              { label: lastTag.value, value: lastTag.value },
                            ]);
                          }
                        }
                        field.onChange(selected);
                      }}
                    />
                  )}
                />
              </Grid>
              <Grid item xs={12}>
                <Typography variant="h6" color="textSecondary">
                  HEF Designation
                </Typography>
              </Grid>
              <Grid item xs={6}>
                <Typography variant="h6" color="textSecondary">
                  State <span style={{ color: "red" }}>*</span>
                </Typography>
                <Controller
                  name="state"
                  control={control}
                  defaultValue=""
                  render={({ field }) => (
                    <>
                      <StyledSelectField
                        placeholder="Choose the state"
                        options={stateOptions}
                        {...field}
                        onChange={(e) => {
                          field.onChange(e);
                          handleStateChange(e);
                        }}
                      />{" "}
                    </>
                  )}
                />
              </Grid>{" "}
              <Grid item xs={6}>
                Zone <span style={{ color: "red" }}>*</span>
                <Controller
                  name="zone"
                  control={control}
                  defaultValue=""
                  render={({ field }) => (
                    <>
                      <StyledSelectField
                        placeholder="Choose the zone"
                        options={zoneOptions}
                        {...field}
                        onChange={(e) => {
                          field.onChange(e);
                          handleZoneChange(e.value);
                        }}
                      />
                    </>
                  )}
                />
              </Grid>{" "}
              <Grid item xs={6}>
                District <span style={{ color: "red" }}>*</span>
                <Controller
                  name="district"
                  control={control}
                  defaultValue=""
                  render={({ field }) => (
                    <>
                      <StyledSelectField
                        placeholder="Choose the district"
                        options={districtOptions}
                        {...field}
                        onChange={(e) => {
                          field.onChange(e);
                          handleDistrictChange(e.value);
                        }}
                      />
                    </>
                  )}
                />
              </Grid>{" "}
              <Grid item xs={6}>
                Chapter <span style={{ color: "red" }}>*</span>
                <Controller
                  name="chapter"
                  control={control}
                  defaultValue=""
                  rules={{ required: "Chapter is required" }}
                  render={({ field }) => (
                    <>
                      <StyledSelectField
                        placeholder="Choose the chapter"
                        options={chapterOptions}
                        {...field}
                      />
                      {errors.chapter && (
                        <span style={{ color: "red" }}>
                          {errors.chapter.message}
                        </span>
                      )}
                    </>
                  )}
                />
              </Grid>
              <Grid item xs={12}>
                <Typography
                  sx={{ marginBottom: 1 }}
                  variant="h6"
                  color="textSecondary"
                >
                  Status <span style={{ color: "red" }}>*</span>
                </Typography>
                <Controller
                  name="status"
                  control={control}
                  defaultValue=""
                  rules={{ required: "Status is required" }}
                  render={({ field }) => (
                    <>
                      <StyledSelectField
                        placeholder="Choose the status"
                        options={statusOptions}
                        {...field}
                      />
                      {errors.status && (
                        <span style={{ color: "red" }}>
                          {errors.status.message}
                        </span>
                      )}
                    </>
                  )}
                />
              </Grid>
              <Grid item xs={6}>
                {" "}
                <Typography
                  variant="body2"
                  color="red"
                  sx={{ marginBottom: 2 }}
                >
                  * Fields are mandatory
                </Typography>
              </Grid>
              <Grid item xs={6}>
                <Stack
                  direction={"row"}
                  spacing={2}
                  justifyContent={"flex-end"}
                >
                  <StyledButton
                    name="Cancel"
                    variant="secondary"
                    onClick={(event) => handleClear(event)}
                    disabled={loadings}
                  />
                  <StyledButton
                    name={loadings ? "Saving..." : "Save"}
                    variant="primary"
                    type="submit"
                    disabled={loadings}
                  />
                </Stack>
              </Grid>
            </Grid>
          </form>
        </Box>
      )}{" "}
    </>
  );
};

export default AddMember;
