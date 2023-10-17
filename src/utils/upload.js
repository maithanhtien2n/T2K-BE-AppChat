const fs = require("fs");

const onConvertFileName = (linkImage) => {
  return `${linkImage.split("/")[linkImage.split("/").length - 1]}`;
};

const onUrlFile = (host, path) => `http://${host}/${path}`;

const onImagePath = (fileName, subPath = "") =>
  `uploads/${subPath}${Date.now()}$${fileName}`;

const onSaveFile = (path, base64) => {
  fs.writeFileSync(path, Buffer.from(base64.split(",")[1], "base64"));
};

const onDeleteFile = (linkFile, subPath = "") => {
  const filePath = `uploads/${subPath}${onConvertFileName(linkFile)}`;
  // Kiểm tra xem tệp có tồn tại không
  if (fs.existsSync(filePath)) return fs.unlinkSync(filePath);
};

module.exports = {
  onConvertFileName,
  onUrlFile,
  onImagePath,
  onSaveFile,
  onDeleteFile,
};
