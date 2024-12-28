function getBathValue() {
  var uiBathrooms = document.getElementsByName("uiBathrooms");
  for(var i in uiBathrooms) {
    if(uiBathrooms[i].checked) {
        return parseInt(i)+1;
    }
  }
  return -1; // Invalid Value
}

function getBHKValue() {
  var uiBHK = document.getElementsByName("uiBHK");
  for(var i in uiBHK) {
    if(uiBHK[i].checked) {
        return parseInt(i)+1;
    }
  }
  return -1; // Invalid Value
}

function onClickedEstimatePrice() {
  console.log("Estimate price button clicked");
  var sqft = document.getElementById("uiSqft");
  var bhk = getBHKValue();
  var bathrooms = getBathValue();
  var location = document.getElementById("uiLocations");
  var estPrice = document.getElementById("uiEstimatedPrice");

   var url = "http://127.0.0.1:5000/predict_home_price"; //Use this if you are NOT using nginx which is first 7 tutorials
 // var url = "/api/predict_home_price"; // Use this if  you are using nginx. i.e tutorial 8 and onwards

  $.post(url, {
      total_sqft: parseFloat(sqft.value),
      bhk: bhk,
      bath: bathrooms,
      location: location.value
  },function(data, status) {
      console.log(data.estimated_price);
      estPrice.innerHTML = "<h2>" + data.estimated_price.toString() + " Lakh</h2>";
      console.log(status);
  });
}

function onPageLoad() {
  console.log( "document loaded" );
   var url = "http://127.0.0.1:5000/get_location_names"; // Use this if you are NOT using nginx which is first 7 tutorials
  //var url = "/api/get_location_names"; // Use this if  you are using nginx. i.e tutorial 8 and onwards
  $.get(url,function(data, status) {
      console.log("got response for get_location_names request");
      if(data) {
          var locations = data.locations;
          var uiLocations = document.getElementById("uiLocations");
          $('#uiLocations').empty();
          for(var i in locations) {
              var opt = new Option(locations[i]);
              $('#uiLocations').append(opt);
          }
      }
  });
}

window.onload = onPageLoad;
// script.js

async function predictPrice() {
  const priceInput = document.getElementById("price-input").value;
  const predictedPriceElement = document.getElementById("predicted-price");
  const propertiesElement = document.getElementById("properties");

  // Clear previous results
  propertiesElement.innerHTML = "";
  predictedPriceElement.textContent = "--";

  if (priceInput) {
      try {
          // Call the prediction API
          const response = await fetch('https://api.example.com/predict', {
              method: 'POST',
              headers: {
                  'Content-Type': 'application/json'
              },
              body: JSON.stringify({ price: Number(priceInput) })
          });

          // Check if the response is successful
          if (!response.ok) throw new Error("Prediction request failed.");

          // Parse the JSON response
          const data = await response.json();
          const predictedPrice = data.predictedPrice;
          const propertyImages = data.propertyImages;

          // Display the predicted price
          predictedPriceElement.textContent = `$${predictedPrice.toFixed(2)}`;

          // Display property images
          if (propertyImages && propertyImages.length > 0) {
              propertyImages.forEach(imageUrl => {
                  const imgElement = document.createElement("img");
                  imgElement.src = imageUrl;
                  imgElement.alt = "Property Image";
                  propertiesElement.appendChild(imgElement);
              });
          } else {
              propertiesElement.innerHTML = "<p>No properties found for this price range.</p>";
          }

      } catch (error) {
          console.error("Error fetching prediction:", error);
          predictedPriceElement.textContent = "Error fetching prediction.";
      }
  } else {
      predictedPriceElement.textContent = "--";
  }
}
