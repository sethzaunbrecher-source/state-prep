import type { Route } from ".react-router/types/app/routes/+types/home";
import CompletedListCard from "public/components/CompletedListCard";

export function meta({}: Route.MetaArgs) {
  return [
    { title: "Nursing Home Admin Practice Exams" },
  ];
}

export default function ProgressDetail() {

  return <CompletedListCard />;
  
}
