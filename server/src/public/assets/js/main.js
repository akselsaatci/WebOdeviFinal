function LoginUser(e) {
  e.preventDefault();
  const email = $("#email").val();
  const password = $("#password").val();
  const data = {
    email: email,
    password: password,
  };
  $.ajax({
    url: "/user/login",
    type: "POST",
    data: JSON.stringify(data),
    contentType: "application/json",
    success: function (response, status, xhr) {
      if (xhr.status === 200) {
        alert("Giriş başarılı");
        window.location.href = "/";
      } else if (xhr.status === 401) {
        alert("Yanlış bilgi girdiniz");
      } else {
        alert("Bir hata oluştu. Kod: " + xhr.status);
      }
    },
    error: function (xhr, status, error) {
      if (xhr.status === 401) {
        alert("Yanlış bilgi girdiniz");
      } else {
        alert("Bir hata oluştu. Kod: " + xhr.status);
      }
    },
  });
}

function RegisterUser(e) {
  e.preventDefault();
  const email = $("#ur_email").val();
  const password = $("#ur_password").val();
  const tc = $("#ur_tc").val();
  const name = $("#ur_name").val();
  const data = {
    email: email,
    password: password,
    tc: tc,
    name: name,
  };
  $.ajax({
    url: "/user/register",
    type: "POST",
    data: JSON.stringify(data),
    contentType: "application/json",
    success: function (response, status, xhr) {
      if (xhr.status === 200) {
        alert("Kayıt başarılı.");
        window.location.href = "/";
      } else if (xhr.status === 401) {
        alert("Bu email veya tc zaten kayıtlı");
      } else {
        alert("Bir hata oluştu. Kod: " + xhr.status);
      }
    },
    error: function (xhr, status, error) {
      if (xhr.status === 401) {
        alert("Bu email veya tc zaten kayıtlı");
      } else {
        alert("Bir hata oluştu. Kod: " + xhr.status);
      }
    },
  });
}

function RegisterCompany(e) {
  e.preventDefault();
  const authorizedPersonName = $("#cr_authorizedPersonName").val();
  const authorizedPersonEmail = $("#cr_authorizedPersonEmail").val();
  const authorizedPersonPassword = $("#cr_authorizedPersonPassword").val();
  const authorizedPersonPhone = $("#cr_authorizedPersonPhone").val();
  const name = $("#cr_name").val();
  const categoryId = $("#cr_categoryId").val();
  const data = {
    authorizedPersonEmail: authorizedPersonEmail,
    authorizedPersonPassword: authorizedPersonPassword,
    authorizedPersonPhone: authorizedPersonPhone,
    authorizedPersonName: authorizedPersonName,
    categoryId: categoryId,
    name: name,
  };
  $.ajax({
    url: "/company/register",
    type: "POST",
    data: JSON.stringify(data),
    contentType: "application/json",
    success: function (response, status, xhr) {
      if (xhr.status === 200) {
        alert("Kayıt başarılı. Lütfen giriş yapınız.");
        window.location.href = "/";
      } else if (xhr.status === 401) {
        alert("Bu email veya tc zaten kayıtlı");
      } else {
        alert("Bir hata oluştu. Kod: " + xhr.status);
      }
    },
    error: function (xhr, status, error) {
      if (xhr.status === 401) {
        alert("Bu email veya tc zaten kayıtlı");
      } else {
        alert("Bir hata oluştu. Kod: " + xhr.status);
      }
    },
  });
}

function LoginCompany(e) {
  e.preventDefault();
  const email = $("#firma_email").val();
  const password = $("#firma_password").val();
  const data = {
    email: email,
    password: password,
  };
  $.ajax({
    url: "/company/login",
    type: "POST",
    data: JSON.stringify(data),
    contentType: "application/json",
    success: function (response, status, xhr) {
      if (xhr.status === 200) {
        alert("Giriş başarılı");
        window.location.href = "/company";
      } else if (xhr.status === 401) {
        alert("Yanlış bilgi girdiniz");
      } else {
        alert("Bir hata oluştu. Kod: " + xhr.status);
      }
    },
    error: function (xhr, status, error) {
      if (xhr.status === 401) {
        alert("Yanlış bilgi girdiniz");
      } else {
        alert("Bir hata oluştu. Kod: " + xhr.status);
      }
    },
  });
}

function getAllCompanies(callback) {
  $.ajax({
    url: "/company/all",
    type: "GET",
    success: function (response, status, xhr) {
      if (xhr.status === 200) {
        callback(response);
      } else if (xhr.status === 401) {
        alert("Yanlış bilgi girdiniz");
      } else {
        alert("Bir hata oluştu. Kod: " + xhr.status);
      }
    },
    error: function (xhr, status, error) {
      if (xhr.status === 500) {
        alert("Serverda bir hata oluştu!");
      } else {
        alert("Bir hata oluştu. Kod: " + xhr.status);
      }
    },
  });
}

function getAllCategories(callback) {
  $.ajax({
    url: "/company/categories/",
    type: "GET",
    success: function (response, status, xhr) {
      if (xhr.status === 200) {
        console.log(response);
        callback(response);
      } else if (xhr.status === 401) {
        alert("Yanlış bilgi girdiniz");
      } else {
        alert("Bir hata oluştu. Kod: " + xhr.status);
      }
    },
    error: function (xhr, status, error) {
      if (xhr.status === 500) {
        alert("Serverda bir hata oluştu!");
      } else {
        alert("Bir hata oluştu. Kod: " + xhr.status);
      }
    },
  });
}

function postComplaint(e) {
  e.preventDefault();
  const title = $("#c_title").val();
  const content = $("#c_content").val();
  const firmId = $("#c_firmId").val();
  const data = {
    title: title,
    content: content,
    firmId: firmId,
  };
  $.ajax({
    url: "/user/complaints",
    type: "POST",
    data: JSON.stringify(data),
    contentType: "application/json",
    dataType: "json",
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
      Authorization: "Bearer " + localStorage.getItem("token"),
    },
    success: function (response, status, xhr) {
      if (xhr.status === 200) {
        alert("Şikayetiniz başarıyla kaydedildi");
        window.location.href = "/user";
      } else if (xhr.status === 401) {
        alert("Lütfen giriş yapınız");
        location.href = "/";
      } else {
        alert("Bir hata oluştu. Kod: " + xhr.status);
      }
    },
    error: function (xhr, status, error) {
      if (xhr.status === 401) {
        alert("Lütfen giriş yapınız");
      } else {
        alert("Bir hata oluştu. Kod: " + xhr.status);
      }
    },
  });
}
