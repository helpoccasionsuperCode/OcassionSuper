// import React from "react";
// import { Eye, EyeOff } from "lucide-react";

// function ShowHideButton({ show, onToggle }) {
//   return (
//     <button
//       type="button"
//       onClick={onToggle}
//       className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-700"
//     >
//       {show ? <EyeOff size={25} /> : <Eye size={25} />}
//     </button>
//   );
// }

// export default ShowHideButton;


import React from "react";
import { Eye, EyeOff } from "lucide-react";

function ShowHideButton({ show, onToggle }) {
  return (
    <button
      type="button"
      onClick={onToggle}
      className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-700"
    >
      {show ? <EyeOff size={25} /> : <Eye size={25} />}
    </button>
  );
}

export default ShowHideButton;
