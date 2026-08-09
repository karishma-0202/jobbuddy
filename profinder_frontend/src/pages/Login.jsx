import { useParams } from "react-router-dom";
import LoginForm from "../components/Auth/LoginForm";

const Login = () => {
  const { type } = useParams();

  return (
    <div className="pt-40 px-32">
      <LoginForm userType={type} />
    </div>
  );
};

export default Login;
