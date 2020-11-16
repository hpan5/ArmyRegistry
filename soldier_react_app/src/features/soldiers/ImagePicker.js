import React, { useState } from 'react'
import { Image } from "semantic-ui-react";
import { useSelector } from 'react-redux';
function ImagePicker(props) {
  const editingUser = useSelector((state) => state.soldiers.editingSoldier);
  const [ imageURL, setImageURL ] = useState(editingUser ? editingUser.imageUrl : "/photos/default_avatar.jpg");
  //console.log("editingUser: ", editingUser);
  //console.log("imageURL: " , imageURL);
  if (props.file) {
    let reader = new FileReader();
    reader.onload = e => setImageURL(e.target.result);
    reader.readAsDataURL(props.file);
  }

  return (
    <div className='left-container'>
      <div className="innerBlock">
        <Image
          src={imageURL}
          alt="preview"
          className="preview-image"
          style={{ height: "100px", objectFit: "cover" }}
        />
        <div>
          <input type="file" onChange={props.onChange}/>
        </div>
      </div>
    </div>
  );
}

export default ImagePicker;
