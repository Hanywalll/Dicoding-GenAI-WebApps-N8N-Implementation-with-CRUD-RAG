import { IKContext, IKImage, IKUpload } from "imagekitio-react";
import { useRef } from "react";

const urlEndpoint = import.meta.env.VITE_IMAGE_KIT_ENDPOINT;
const publicKey = import.meta.env.VITE_IMAGE_KIT_PUBLIC_KEY;

const authenticator = async () => {
  try {
    const response = await fetch("http://localhost:3000/api/upload");

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(
        `Request failed with status ${response.status}: ${errorText}`
      );
    }

    const data = await response.json();
    const { signature, expire, token } = data;
    return { signature, expire, token };
  } catch (error) {
    throw new Error(`Authentication request failed: ${error.message}`);
  }
};

const Upload = ({ setImg }) => {
  const ikUploadRef = useRef(null);
  const onError = (err) => {
    console.log("Error", err);
  };

  const onSuccess = (res) => {
    console.log("Success", res);
    setImg((prev) => ({ ...prev, isLoading: false, dbData: res }));
  };

  const onUploadProgress = (progress) => {
    console.log("Progress", progress);
  };

  const onUploadStart = (evt) => {
    const file = evt.target.files[0];

    const reader = new FileReader();
    reader.onloadend = () => {
      setImg((prev) => ({
        ...prev,
        isLoading: true,
        aiData: {
          inlineData: {
            data: reader.result.split(",")[1],
            mimeType: file.type,
          },
        },
      }));
    };
    reader.readAsDataURL(file);
  };

  return (
    <IKContext
      urlEndpoint={urlEndpoint}
      publicKey={publicKey}
      authenticator={authenticator}
    >
      <IKUpload
        fileName="test-upload.png"
        onError={onError}
        onSuccess={onSuccess}
        useUniqueFileName={true}
        onUploadProgress={onUploadProgress}
        onUploadStart={onUploadStart}
        style={{ display: "none" }}
        ref={ikUploadRef}
      />
      {
        <label onClick={() => ikUploadRef.current.click()}>
          <svg
            data-name="Layer 2"
            id="Layer_2"
            viewBox="0 0 35 35"
            xmlns="http://www.w3.org/2000/svg"
            height="24px"
            width="24px"
            fill="currentColor"
          >
            <path d="M18,34.75A11.32,11.32,0,0,1,6.69,23.45V8A7.78,7.78,0,0,1,22.25,8V22.49a4.58,4.58,0,1,1-9.15,0V9.29a1.25,1.25,0,0,1,2.5,0v13.2a2.08,2.08,0,1,0,4.15,0V8A5.28,5.28,0,0,0,9.19,8V23.45A8.82,8.82,0,0,0,18,32.25c4.6,0,7.81-3.62,7.81-8.8V9.66a1.25,1.25,0,0,1,2.5,0V23.45C28.31,30,24,34.75,18,34.75Z"/>
          </svg>
        </label>
      }
    </IKContext>
  );
};

export default Upload;