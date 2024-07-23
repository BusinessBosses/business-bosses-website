import * as React from "react";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Container from "@mui/material/Container";
import InputLabel from "@mui/material/InputLabel";
import Link from "@mui/material/Link";
import Stack from "@mui/material/Stack";
import TextField from "@mui/material/TextField";
import Typography from "@mui/material/Typography";

import { visuallyHidden } from "@mui/utils";
import { styled } from "@mui/material/styles";
import Assets from "../../../../assets";
import ComputerBossuppartnersection from "../../../bossuppartnerpage/computerbossupsection";
import PartnersField from "./partnerstiles";
import RoutesPath from "../../../../constants/Routes";
import { useNavigate } from "react-router-dom";
import { Card } from "@mui/material";
import FilledInput from "../../../../common/components/inputs/FilledInput";
import Post from "../../../profile/views/components/Post";
import FilledSelect from "../../../../common/components/inputs/FilledSelect";

const StyledBox = styled("div")(({ theme }) => ({
  alignSelf: "center",
  width: "100%",
  height: 400,
  marginTop: theme.spacing(8),
  borderRadius: theme.shape.borderRadius,
  outline: "1px solid",
  boxShadow: "0 0 12px 8px hsla(220, 25%, 80%, 0.2)",
  backgroundImage: `url(${"/static/images/templates/templates-images/hero-light.png"})`,
  outlineColor: "hsla(220, 25%, 80%, 0.5)",
  backgroundSize: "cover",
  [theme.breakpoints.up("sm")]: {
    marginTop: theme.spacing(10),
    height: 700,
  },
  // ...theme.applyStyles('dark', {
  //   boxShadow: '0 0 24px 12px hsla(210, 100%, 25%, 0.2)',
  //   backgroundImage: `url(${'/static/images/templates/templates-images/hero-dark.png'})`,
  //   outlineColor: 'hsla(210, 100%, 80%, 0.1)',
  // }),
}));

export default function BecomeAPartnerHero() {
  const navigate = useNavigate();

  return (
    <Box
      id="hero"
      sx={(theme) => ({
        width: "100%",
        backgroundColor: "#f4f4f4",
        backgroundRepeat: "no-repeat",
        // ...theme.applyStyles('dark', {
        //   backgroundImage:
        //     'radial-gradient(ellipse 80% 50% at 50% -20%, hsl(210, 100%, 16%), transparent)',
        // }),
      })}
    >
      <Container
        sx={{
          display: "flex",
          flexDirection: { md: "row", xs: "column" },
          alignItems: "start",
          pt: { xs: 10, sm: 10 },
          pb: { xs: 10, sm: 10 },
        }}
      >
        <div style={{ alignItems: "center" }}>
          <Stack
            spacing={2}
            useFlexGap
            sx={{ alignItems: "center", width: { xs: "100%", sm: "100%" } }}
          >
            <Typography
              variant="h1"
              sx={{
                display: "flex",
                flexDirection: { xs: "column", sm: "row" },
                alignItems: "center",
                fontSize: { xs: "30px", md: "40px" },
                justifyContent: "center",
                textAlign: "center",
                width: { sm: "100%", md: "100%" },
              }}
            >
              Partner with Us
            </Typography>
            <Typography
              sx={{
                textAlign: "center",
                color: "text.secondary",
                width: { sm: "100%", md: "100%" },
                pb: { xs: 2, sm: 2 },
              }}
            >
              Join us in this exciting journey as we empower entrepreneurs with
              the resources they need to succeed and contribute to economic
              development.
            </Typography>
            <Typography
              sx={{
                textAlign: "center",
                color: "text.secondary",
                width: { sm: "100%", md: "100%" },
                pb: { xs: 2, sm: 2 },
              }}
            >
              If you have any questions, please don’t hesitate to reach out at -
              <a
                href="mailto:support@businessbosses.co.uk"
                style={{ color: "blue", textDecoration: "underline" }}
              >
                support@businessbosses.co.uk
              </a>
            </Typography>
          </Stack>
        </div>

        <div>
          <Container>
            <Stack
              direction="column"
              component={Card}
              spacing={1}
              useFlexGap
              sx={{
                color: "inherit",
                p: 3,
                height: "100%",
                width: "100%",
                // border: "1px solid",
                // borderColor: "hsla(220, 25%, 25%, .3)",
                background: "transparent",
                backgroundColor: "#ffffff",
                boxShadow: "none",
              }}
            >
              <div>
                <Typography
                  sx={{
                    textAlign: "center",
                    color: "text.secondary",
                    width: { sm: "100%", md: "100%" },
                    pb: { xs: 2, sm: 2 },
                  }}
                >
                  Please complete the form and a member of our team will contact
                  you to set up your partnership
                </Typography>
                <FilledInput
                  // inputRef={}
                  onchange={() => {}}
                  placeholder="Your name"
                  type="name"
                />
                <FilledInput
                  // inputRef={}
                  onchange={() => {}}
                  placeholder="Company name"
                  type="name"
                />
                <FilledInput
                  // inputRef={}
                  onchange={() => {}}
                  placeholder="Phone"
                  type="name"
                />
                <FilledInput
                  // inputRef={}
                  onchange={() => {}}
                  placeholder="Location"
                  type="name"
                />

                <FilledInput
                  // inputRef={}
                  onchange={() => {}}
                  placeholder="Link to redeem the deal"
                  type="name"
                />

                <FilledSelect
                  defaultValue="{profile?.ageRange}"
                  // inputRef={ageRef}
                  data={["Type of Partnership", "18 - 30", "24 - 56"]}
                  onchange={() => {}}
                />

                <FilledSelect
                  defaultValue="{profile?.ageRange}"
                  // inputRef={ageRef}
                  data={["Budget", "18 - 30", "24 - 56"]}
                  onchange={() => {}}
                />

                <div style={{ position: "relative" }}>
                  <textarea
                    // ref={postTitleRef}
                    name=""
                    id=""
                    defaultValue={""}
                    placeholder="Company Bio"
                    className="w-full outline-none border-[1px] border-[#EAEAEA] placeholder:text-[#A9A9A9] rounded-lg p-3 text-sm resize-none bg-[#F4F4F4]"
                    rows={8}
                    maxLength={300}
                    // onChange={handleInputChange}
                  ></textarea>
                  <p
                    style={{
                      position: "absolute",
                      bottom: "20px",
                      right: "50px",
                      fontSize: "12px",
                      color: "#A9A9A9",
                    }}
                  >
                    0/300
                  </p>
                </div>

                <div style={{ position: "relative" }}>
                  <textarea
                    // ref={postTitleRef}
                    name=""
                    id=""
                    defaultValue={""}
                    placeholder="Description of your deals/offering"
                    className="w-full outline-none border-[1px] border-[#EAEAEA] placeholder:text-[#A9A9A9] rounded-lg p-3 text-sm resize-none bg-[#F4F4F4]"
                    rows={8}
                    maxLength={300}
                    // onChange={handleInputChange}
                  ></textarea>
                  <p
                    style={{
                      position: "absolute",
                      bottom: "20px",
                      right: "50px",
                      fontSize: "12px",
                      color: "#A9A9A9",
                    }}
                  >
                    0/300
                  </p>
                </div>

                <div style={{ position: "relative" }}>
                  <textarea
                    // ref={postTitleRef}
                    name=""
                    id=""
                    defaultValue={""}
                    placeholder="Add customised message"
                    className="w-full outline-none border-[1px] border-[#EAEAEA] placeholder:text-[#A9A9A9] rounded-lg p-3 text-sm resize-none bg-[#F4F4F4]"
                    rows={8}
                    maxLength={300}
                    // onChange={handleInputChange}
                  ></textarea>
                  <p
                    style={{
                      position: "absolute",
                      bottom: "20px",
                      right: "50px",
                      fontSize: "12px",
                      color: "#A9A9A9",
                    }}
                  >
                    0/300
                  </p>
                </div>

                <div
                  className="px-5 pt-10"
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    justifyContent: "center",
                    alignItems: "center",
                  }}
                >
                  <div className="mt-3 gap-2">
                    <div
                      style={{
                        display: "flex",
                        justifyContent: "center",
                        alignItems: "center",
                      }}
                    >
                      <button
                        onClick={() => navigate(RoutesPath.becomeapartner)}
                        className={`bg-primary rounded-xl py-3.5 text-white text-md flex items-center justify-center font-bold p-2 px-20`}
                      >
                        Submit
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </Stack>
          </Container>
        </div>
      </Container>
    </Box>
  );
}
