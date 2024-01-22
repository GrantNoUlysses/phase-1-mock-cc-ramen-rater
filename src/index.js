//fetch("http://localhost:3000/ramens")
 // .then((res) => res.json())
//  .then((data) => {
 //   console.log(data);
 //   renderRamenDetail(data[0]);
 //   for (let ramen of data) {
 //     renderImage(ramen);
 //   }
 // });
 fetch("http://localhost:3000/ramens")
 .then((res) => res.json())
 .then((data) => {
   console.log(data);

   // Display details for the first ramen
   if (data.length > 0) {
     renderRamenDetail(data[0]);
   }

   // Render images for all ramens
   for (let ramen of data) {
     renderImage(ramen);
   }
 })
 .catch((error) => console.error("Error fetching ramens:", error));

function renderImage(ramen) {
  let menuDiv = document.querySelector("#ramen-menu");

  let ramenImage = document.createElement("img");

  ramenImage.src = ramen.image;

  menuDiv.append(ramenImage);

  ramenImage.addEventListener("click", () => {
    renderRamenDetail(ramen);
  });

  ramenImage.addEventListener("dblclick", () => {
    fetch("http://localhost:3000/ramens/" + ramen.id, {
      method: "DELETE",
    })
      .then(() => {
        // Remove the image from the UI on successful deletion
        ramenImage.remove();
      })
      .catch((error) => console.error("Error deleting ramen:", error));
  });
}

function renderRamenDetail(ramen) {
  let image = document.querySelector(".detail-image");
  image.src = ramen.image;

  let name = document.querySelector(".name");
  name.textContent = ramen.name;

  let restaurant = document.querySelector(".restaurant");
  restaurant.textContent = ramen.restaurant;

  let rating = document.getElementById("rating-display");

  rating.textContent = ramen.rating;

  let comment = document.getElementById("comment-display");

  comment.textContent = ramen.comment;

  const updateForm = document.createElement("form");
  updateForm.innerHTML = `
    <label for="new-rating">New Rating: </label>
    <input type="number" id="new-rating" name="new-rating" />
    <label for="new-comment">New Comment: </label>
    <textarea id="new-comment" name="new-comment"></textarea>
    <button type="submit">Update</button>
  `;
  updateForm.addEventListener("submit", (e) => {
    e.preventDefault();

    const newRating = document.getElementById("new-rating").value;
    const newComment = document.getElementById("new-comment").value;

    // Perform the update using a PATCH request
    fetch(`http://localhost:3000/ramens/${ramen.id}`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        rating: newRating,
        comment: newComment,
      }),
    })
      .then((res) => res.json())
      .then((updatedRamen) => {
        console.log("Updated Ramen:", updatedRamen);
        // Update the displayed rating and comment
        rating.textContent = updatedRamen.rating;
        comment.textContent = updatedRamen.comment;
      })
      .catch((error) => console.error("Error updating ramen:", error));
  });

}

let form = document.querySelector("#new-ramen");
form.addEventListener("submit", (e) => {
  e.preventDefault();
  console.log(
    e.target.name.value,
    e.target.restaurant.value,
    e.target.image.value
  );

  let newRamen = {
    name: e.target.name.value,
    restaurant: e.target.restaurant.value,
    image: e.target.image.value,
    rating: e.target.rating.value,
    comment: e.target["new-comment"].value,
  };

  fetch("http://localhost:3000/ramens", {
    method: "POST",
    headers: {
      "content-type": "Application/json",
    },
    body: JSON.stringify(newRamen),
  })
    .then((res) => res.json())
    .then((data) => {
      console.log(data);
      renderImage(data);
    });
});