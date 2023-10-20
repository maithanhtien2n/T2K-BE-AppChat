const generateRandomCode = (v1, v2, length) => {
  var characters = `${v1}${v2}`;
  var code = "";

  for (var i = 0; i < length; i++) {
    var randomIndex = Math.floor(Math.random() * characters.length);
    code += characters.charAt(randomIndex);
  }

  return code;
};

const formatDate = (dateString, showTime = false) => {
  const date = new Date(dateString);

  const formattedDate = date.toLocaleDateString("vi-VN", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  const formattedTime = date.toLocaleTimeString("vi-VN", {
    hour: "2-digit",
    minute: "2-digit",
  });

  return showTime ? `${formattedTime} ${formattedDate}` : formattedDate;
};

module.exports = { generateRandomCode, formatDate };
