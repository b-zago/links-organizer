import { useState } from "react";
import AddItem from "../components/AddItem";
import "./home.css";
import AddItemModal from "../components/AddForm";

function Home() {
  const [isFormOpen, setIsFormOpen] = useState(false);

  return (
    <>
      {isFormOpen && <AddItemModal openForm={setIsFormOpen} />}
      <div className="items-wrapper">
        <AddItem openForm={setIsFormOpen} />
      </div>
    </>
  );
}

export default Home;
