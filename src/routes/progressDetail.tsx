import type { Route } from ".react-router/types/app/routes/+types/home";
import ProgressDetailCard from "public/components/ProgressQuestionCard";

export function meta({}: Route.MetaArgs) {
  return [
    { title: "Nursing Home Admin Practice Exams" },
  ];
}

export default function ProgressDetail() {

  return <ProgressDetailCard />;
  
}
