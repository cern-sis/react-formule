import { Upload, message, Tooltip, Typography, Image, Empty } from "antd";
import { UploadOutlined } from "@ant-design/icons";
import { useContext, useEffect, useState } from "react";
import CustomizationContext from "../../../contexts/CustomizationContext";
import { useDispatch } from "react-redux";
import {
  addFile,
  removeExistingFile,
  removeNewFile,
} from "../../../store/schemaWizard";

const FileField = ({
  disabled,
  registry,
  id,
  onBlur,
  onChange,
  onFocus,
  readonly,
  formData,
  schema,
}) => {
  const { formContext } = registry;
  const { readonlyAsDisabled = true } = formContext;
  const isDisabled = disabled || (readonlyAsDisabled && readonly);
  const [previewOpen, setPreviewOpen] = useState(false);
  const [previewImage, setPreviewImage] = useState("");
  const [initialFiles, setInitialFiles] = useState([]);
  const [files, setFiles] = useState([]);

  const dispatch = useDispatch();

  const customizationContext = useContext(CustomizationContext);

  const maxFiles = schema.maxFiles || Infinity;
  const allowedExtensions = schema.accept || [];
  const disablePreview = schema.disablePreview || false;

  // Generates thumbnails for images loaded on startup, as those don't
  // go through antd's upload pipeline which would normally take care of this
  const generateThumbnail = async (url) => {
    return new Promise((resolve, reject) => {
      const img = new window.Image();
      img.crossOrigin = "anonymous";
      img.onload = () => {
        const canvas = document.createElement("canvas");
        const ctx = canvas.getContext("2d");

        const maxSize = 200;
        const ratio = Math.min(maxSize / img.width, maxSize / img.height);
        canvas.width = img.width * ratio;
        canvas.height = img.height * ratio;

        ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
        resolve(canvas.toDataURL("image/jpeg", 0.7));
      };
      img.onerror = reject;
      img.src = url;
    });
  };

  // Fetch files on first load based on formData uids if fetchFile provided
  useEffect(() => {
    if (
      !formData?.length ||
      !customizationContext?.customFunctions?.file?.fetchFile
    )
      return;

    const fetchFiles = async () => {
      const loadedFiles = await Promise.all(
        formData.slice(0, maxFiles).map(async (uid) => {
          try {
            const objectUrl =
              await customizationContext.customFunctions.file.fetchFile(uid);

            setInitialFiles((prev) => [...prev, uid]);

            const response = await fetch(objectUrl);
            const blob = await response.blob();

            return {
              uid,
              name: uid,
              type: blob.type,
              preview: objectUrl,
              thumbUrl:
                !disablePreview && blob.type.startsWith("image/")
                  ? await generateThumbnail(objectUrl)
                  : undefined,
            };
          } catch (err) {
            message.error(`Error loading file ${uid}: ${err.message}`);
            return null;
          }
        }),
      );

      setFiles(loadedFiles.filter(Boolean));
    };

    fetchFiles();

    // Cleanup object URLs when component unmounts
    return () => {
      files.forEach((file) => {
        URL.revokeObjectURL(file.preview);
        URL.revokeObjectURL(file.thumbUrl);
      });
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handlePreview = (file) => {
    if (file.preview || file.thumbUrl) {
      setPreviewImage(file.preview || file.thumbUrl);
      setPreviewOpen(true);
    } else {
      message.warning("No preview available for this file");
    }
  };

  const handleChange = async ({ file, fileList }) => {
    let updatedFiles = [];

    if (file.status === "removed") {
      // Removed files
      if (initialFiles.includes(file.uid)) {
        dispatch(removeExistingFile({ uid: file.uid }));
      } else {
        dispatch(removeNewFile({ uid: file.uid }));
      }
      updatedFiles = files.filter((f) => f.uid !== file.uid);
      setFiles(updatedFiles);
      URL.revokeObjectURL(file.preview);
      URL.revokeObjectURL(file.thumbUrl);
    } else {
      // Only process new files (those with no status).
      // Can't simply use `file` as preview generation from it doesn't work,
      // therefore we need to read them from fileList and avoid redundant processing.
      const existingFileUids = new Set(files.map((f) => f.uid));
      const newFiles = fileList.filter((f) => {
        return !existingFileUids.has(f.uid) && !f.status;
      });

      if (newFiles.length > 0) {
        newFiles.forEach((file) => {
          const objectUrl = URL.createObjectURL(file.originFileObj);

          if (disablePreview) {
            file.thumbUrl = null;
          } else {
            file.preview = objectUrl;
          }
          file.status = "done";

          dispatch(addFile({ uid: file.uid, objectUrl }));
        });

        updatedFiles = [...files, ...newFiles];
        setFiles(updatedFiles);
      }
    }
    onChange(updatedFiles.map((file) => file.uid));
  };

  const itemRender = (originNode, file) => {
    return (
      <Tooltip title={file.name} placement="top">
        {originNode}
      </Tooltip>
    );
  };

  const uploadButton = (
    <div>
      <UploadOutlined />
      <div style={{ marginTop: 8 }}>Upload</div>
    </div>
  );

  return (
    <>
      <Upload
        multiple={maxFiles > 1}
        beforeUpload={
          () => false // Prevent automatic upload
        }
        onChange={handleChange}
        onPreview={handlePreview}
        onBlur={() => onBlur(id, formData)}
        onFocus={() => onFocus(id, formData)}
        fileList={files}
        disabled={isDisabled}
        maxCount={maxFiles}
        listType="picture-card"
        accept={allowedExtensions.join(",")}
        itemRender={itemRender}
      >
        {files.length < maxFiles && !isDisabled && uploadButton}
      </Upload>
      {files.length === 0 && isDisabled && (
        <Empty
          image={Empty.PRESENTED_IMAGE_SIMPLE}
          style={{ margin: 5 }}
          styles={{ image: { height: 30 } }}
          description="No files uploaded"
        />
      )}
      {allowedExtensions.length > 0 && (
        <Typography.Text type="secondary" data-cy="fileAllowedExtensionsText">
          {`Allowed file extensions: ${allowedExtensions
            .filter((e) => e?.startsWith("."))
            .join(", ")}`}
        </Typography.Text>
      )}
      {previewImage && (
        <Image
          wrapperStyle={{ display: "none" }}
          preview={{
            visible: previewOpen,
            onVisibleChange: (visible) => setPreviewOpen(visible),
          }}
          src={previewImage}
        />
      )}
    </>
  );
};

export default FileField;
