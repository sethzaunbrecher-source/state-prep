import type { Route } from ".react-router/types/app/routes/+types/home";
import SavedProgress from "public/components/SavedProgress";

export function meta({}: Route.MetaArgs) {
  return [
    { title: "Nursing Home Admin Practice Exams" },
  ];
}

export default function InProgress() {

  return <SavedProgress />;
  
}
