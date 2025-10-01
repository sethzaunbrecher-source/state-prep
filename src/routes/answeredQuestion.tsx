import AnsweredCard from "../components/AnsweredCard";
import type { Route } from ".react-router/types/app/routes/+types/home";


export function meta({}: Route.MetaArgs) {
  return [
    { title: "Nursing Home Admin Practice Exams" },
  ];
}

export default function ProgressDetail() {

  return <AnsweredCard/>;
  
}
