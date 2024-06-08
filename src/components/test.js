const requestOptions = {
    method: "GET",
    redirect: "follow"
  };
  
  fetch("http://127.0.0.1:5000/schedules", requestOptions)
    .then((response) => response.json())
    .then((result) => console.log(  result))
    .catch((error) => console.error(error));