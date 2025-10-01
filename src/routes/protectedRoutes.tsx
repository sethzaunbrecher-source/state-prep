import type { Route } from ".react-router/types/app/routes/+types/home";
import ProtectedRoute from "public/database/ProtectedRoute";

export function meta({}: Route.MetaArgs) {
  return [
    { title: "Nursing Home Admin Practice Exams" },
    //{ name: "description", content: "Welcome to React Router!" },
  ];
}

export default function PrivateRoutes() {

  return <ProtectedRoute />;
  
}
