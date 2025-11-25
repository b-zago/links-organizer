function AddItem({
  openForm,
}: {
  openForm: React.Dispatch<React.SetStateAction<boolean>>;
}) {
  return (
    <div onClick={() => openForm(true)} className="add-item-wrapper item">
      <button>+</button>
    </div>
  );
}

export default AddItem;
