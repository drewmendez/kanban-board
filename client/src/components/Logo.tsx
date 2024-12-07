import ImgLogo from "../assets/logo.png";

export default function Logo() {
  return (
    <div className="flex items-center gap-1">
      <img src={ImgLogo} alt="logo" className="size-9" />
      <span className="text-lg font-bold text-textBlack">Kanban Board</span>
    </div>
  );
}
