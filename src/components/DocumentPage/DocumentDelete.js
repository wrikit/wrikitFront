import { useState } from "react";
import axios from "axios";

const DocumentDelete = ({ documentId }) => {
  const [isDeleting, setIsDeleting] = useState(false);

  const handleDelete = async () => {
    setIsDeleting(true);
    try {
      const response = await axios.delete(`/api/documents/${documentId}`);
      console.log(response.data); // 서버에서 보내는 성공 메시지
      setIsDeleting(false);
      // 문서 삭제 후 목록 새로고침
      window.location.reload();
    } catch (error) {
      console.error(error);
      setIsDeleting(false);
    }
  };

  return (
    <div>
      {isDeleting ? (
        <p>문서 삭제중입니다...</p>
      ) : (
        <button onClick={handleDelete}>삭제</button>
      )}
    </div>
  );
};

export default DocumentDelete;
