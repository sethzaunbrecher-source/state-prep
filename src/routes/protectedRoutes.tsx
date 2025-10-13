import ProtectedRoute from "../database/ProtectedRoute";

export function meta({}) {
  return [
    { title: "Nursing Home Admin Practice Exams" },
    //{ name: "description", content: "Welcome to React Router!" },
  ];
}

export default function PrivateRoutes() {

  return <ProtectedRoute />;
  
}
