import { Tabs, useMediaQuery, useTheme } from "@mui/material";

/** Same as MUI Tabs on desktop; scrollable only below `sm`. */
const ResponsiveTabs = ({ children, ...props }) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

  return (
    <Tabs
      {...props}
      variant={isMobile ? "scrollable" : "standard"}
      scrollButtons={isMobile ? "auto" : false}
      allowScrollButtonsMobile={isMobile}
    >
      {children}
    </Tabs>
  );
};

export default ResponsiveTabs;
