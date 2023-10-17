const checkNull = (body, fields) => {
  const missingFields = [];
  fields.forEach((field) => {
    if (!body[field] || body[field].trim() === "") {
      missingFields.push(field);
    }
  });
  if (missingFields.length > 0) {
    throw {
      statusCode: 240,
      statusValue: "Lỗi code không kiểm tra null!",
    };
  }
};

module.exports = {
  onResponse: async (
    req,
    res,
    onModel,
    { checkData = [], data = {}, message = "" }
  ) => {
    try {
      if (checkData[0]) checkNull(req.body, checkData);

      const response = await onModel(data);

      return res.status(200).json({
        success: true,
        statusCode: 200,
        statusValue: message ? message : "OK",
        data: response,
      });
    } catch (error) {
      return res.json({
        success: false,
        statusCode: error.statusCode ? error.statusCode : 204,
        statusValue: error.statusValue ? error.statusValue : error,
        data: null,
      });
    }
  },

  throwError: (statusCode, statusValue) => {
    throw { statusCode, statusValue };
  },

  generateRandomCode: (v1, v2, length) => {
    var characters = `${v1}${v2}`;
    var code = "";

    for (var i = 0; i < length; i++) {
      var randomIndex = Math.floor(Math.random() * characters.length);
      code += characters.charAt(randomIndex);
    }

    return code;
  },

  formatToVND: (amount) => {
    return new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
    }).format(amount);
  },
};
