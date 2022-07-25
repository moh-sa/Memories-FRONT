//Packages
import { loginSchema } from "rules";
import { yupResolver } from "@hookform/resolvers/yup";
//Hooks
import { useState } from "react";
import { useDispatch } from "react-redux";
import { useNavigate, useLocation } from "react-router-dom";
import { useForm } from "react-hook-form";
import { useStyles } from "./styles";
//Actions
import { login } from "store/auth/auth.thunk";
//Components
import { Link } from "react-router-dom";
import { FormProvider } from "react-hook-form";
//UI Components
import { Button, Anchor, Paper } from "@mantine/core";
import { Title, Text, Container, Stack } from "@mantine/core";
import ResponseAlert from "components/common/Alert/ResponseAlert";
import ControlledField from "components/common/ControlledInputField/ControlledField";
import ControlledPasswordField from "components/ControlledPasswordField/ControlledPasswordField";

//Icons
import { TbSend } from "react-icons/tb";
//Variables

const Login = () => {
  const { classes } = useStyles();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const form = location.state?.form?.pathname || "/";

  const [isLoading, setIsLoading] = useState(false);
  const [showResMsg, setShowResMsg] = useState(false);
  const [resMsg, setResMsg] = useState("");

  const methods = useForm({
    resolver: yupResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const onSubmit = async (data) => {
    setShowResMsg(false);
    setIsLoading(true);
    const { payload } = await dispatch(login(data));

    if (payload?.code) {
      const msg =
        payload?.code === "ERR_NETWORK"
          ? "Cannot connect to the server. Please check your connection."
          : payload?.response?.data?.message;
      setResMsg(msg);
      setShowResMsg(true);
    } else {
      navigate(form, { replace: true });
    }

    setIsLoading(false);
  };

  return (
    <section>
      {/* Welcome phrase + redirect to register page */}
      <div>
        <Title align="center" className={classes.title}>
          Welcome back!
        </Title>
        <Text color="dimmed" size="sm" align="center" mt={5}>
          <Anchor component={Link} to="/register" size="sm">
            Don't have an account? Register
          </Anchor>
        </Text>
      </div>
      <Container size="25em">
        <Paper withBorder className={classes.paper}>
          {/* response message  */}
          {showResMsg && <ResponseAlert isSuccess={false} msg={resMsg} />}

          <form onSubmit={methods.handleSubmit(onSubmit)}>
            {/* Form Context */}
            <FormProvider {...methods}>
              <Stack>
                {/* Email Field */}
                <ControlledField
                  name="email"
                  type="email"
                  label="Email"
                  holder="example@example.com"
                />

                {/* Password Field */}
                <ControlledPasswordField
                  name="password"
                  label="Password"
                  holder="Your password"
                />
              </Stack>
            </FormProvider>

            <Button
              mt="xl"
              type="submit"
              loading={isLoading}
              disabled={isLoading}
              loaderPosition="right"
              leftIcon={<TbSend size={18} />}
              fullWidth
            >
              Login
            </Button>
          </form>
        </Paper>
      </Container>
    </section>
  );
};

export default Login;