import { useParams } from "react-router-dom";
import RecruiterRegisterForm from "../components/Auth/RecruiterRegisterForm";
import CandidateRegisterForm from "../components/Auth/CandidateRegisterForm";

const Register = () => {
  const { type } = useParams();

  return <div className="pt-40 px-32">{type === "recruiter" ? <RecruiterRegisterForm /> : <CandidateRegisterForm />}</div>;
};

export default Register;
