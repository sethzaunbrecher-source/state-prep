import type { Route } from ".react-router/types/app/routes/+types/home";
import LoginCard from "../components/Login"

export function meta({}: Route.MetaArgs) {
  return [
    { title: "Nursing Home Admin Practice Exams" },
    //{ name: "description", content: "Welcome to React Router!" },
  ];
}

export default function Logins() {

  return <LoginCard />;
  
}
