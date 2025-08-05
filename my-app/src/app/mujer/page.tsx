// Update the import path and extension if the file exists with a different name or extension
import CategoryPage from "../components/CategoryPage";
// or, if the file is named CategoryPage.tsx in the same folder, use:
// import CategoryPage from "./components/CategoryPage.tsx";

export default function MujerPage() {
  return (
    <CategoryPage 
      title="Ropa Deportiva para Mujer"
      description="Descubre nuestra colección de ropa deportiva diseñada especialmente para mujeres activas"
      category="mujer"
    />
  );
}