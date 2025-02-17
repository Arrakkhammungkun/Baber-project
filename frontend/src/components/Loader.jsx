import { useEffect } from "react";
import "../../src/index.css";

const Loader = () => {
  useEffect(() => {
    document.documentElement.style.overflow = "hidden"; // ป้องกันการเลื่อน
    document.body.style.overflow = "hidden"; // ป้องกันการเลื่อน
    return () => {
      document.documentElement.style.overflow = ""; // คืนค่าเดิมเมื่อโหลดเสร็จ
      document.body.style.overflow = ""; // คืนค่าเดิมเมื่อโหลดเสร็จ
    };
  }, []);

  return (
    <div className="loader">
      <span className="loading-text">Loading...</span>
    </div>
  );
};

export default Loader;
