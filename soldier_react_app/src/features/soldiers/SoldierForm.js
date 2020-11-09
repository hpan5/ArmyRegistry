import React, { useState, useEffect } from 'react'
import { connect } from 'react-redux';
import { Field, reduxForm, setSubmitFailed } from 'redux-form'
import { useSelector, useDispatch } from 'react-redux';
import { fetchSuperiorCandidates } from './SoldiersSlice';
import { Image } from "semantic-ui-react";
import '../../styles/Form.css'
let SoldierForm = (props) => {
  const { handleSubmit, valid, onCancel, setImage} = props
  const dispatch = useDispatch();
  const superiorCandidates = useSelector((state) => state.soldiers.superiorCandidates);
  const editingSoldier = useSelector((state) => state.soldiers.editingSoldier);
  const [imageUrl, setImageUrl] = useState('https://res.cloudinary.com/doris0411/image/upload/v1604876329/default_avatar_tyoesk.jpg');
  
  useEffect(() => {
    if (superiorCandidates === undefined || superiorCandidates.length === 0) {
      dispatch(fetchSuperiorCandidates({}));
    }
  }, [dispatch, superiorCandidates]);
  //console.log(superiorCandidates);

  const handleChange = (event, input) => {
    //event.preventDefault();
    const imageFile = event.target.files[0];
    console.log("imageFile:" , imageFile);
    //input.onChange(imageFile ? imageFile.name : undefined);
    if (imageFile) {
      const localImageUrl = URL.createObjectURL(imageFile);
      const imageObject = new window.Image();
      imageObject.onload = () => {
        imageFile.width = imageObject.naturalWidth;
        imageFile.height = imageObject.naturalHeight;
        input.onChange(imageFile);
        URL.revokeObjectURL(imageFile);
      };
      imageObject.src = localImageUrl;
      console.log("imageFile: " , imageFile);
      console.log("localImageUrl: " , localImageUrl);
      //console.log("type of setImage: " , typeof setImage);
      setImage(imageFile);
      setImageUrl(localImageUrl);
    }
    //console.log(image);
  }
  const renderInput = ({ input, type, meta }) => {
    console.log("input: " , input);
    console.log("type: " , type);
    console.log("meta: " , meta);
    return (
      <div>
        <input
          name={input.name}
          type={type}
          onChange={event => handleChange(event, input)}
        />
      </div>
    );
  };


  //<input type='file' name='image' onChange={onImageBrowse} />
  return (
    <form onSubmit={handleSubmit} >
      <button type="submit" disabled={!valid}> Save </button>
      <button type="button" onClick={onCancel}> Cancel </button>
      <div className='left-container'>
        <Image
          src={imageUrl}
          alt="preview"
          className="preview-image"
          style={{ height: "100px", objectFit: "cover" }}
        />
        <div>
          <Field name="image" id="image" component={renderInput} type="file"/>
        </div>
      </div>
      <div className="right-container">
        <div>
          <label htmlFor="name"> Name: </label>
          <Field name="name" id="name" component={newField} type="text" />
        </div>
        <div>
          <label htmlFor="rank"> Rank: </label>
            <Field name="rank" id="rank" component="select">
              <option />
              {
                rankOptions.map((rankOption, i) => {
                  return (
                    <option key={i} value={rankOption}> { rankOption } </option>          
                  )
                })
              }
            </Field>
        </div>

        <div>
          <label htmlFor="sex"> Sex: </label>
          <label>
            <Field name="sex" component="input" type="radio" value="M" />{' '}
              Male
          </label>
          <label>
            <Field name="sex" component="input" type="radio" value="F" />{' '}
              Famale
          </label>
        </div>

        <div>
          <label htmlFor="startDate"> startDate: </label>
          <Field name="startDate" id="startDate" component={newField} type="text" />
        </div>
        
        <div>
          <label htmlFor="phone"> Office Phone: </label>
          <Field name="phone" id="phone" component={newField} type="text" />
        </div>
      
        <div>
          <label htmlFor="email"> Email: </label>
          <Field name="email" id="email" component={newField} type="text" />
        </div>
      
        <div>
          <label htmlFor="Superior"> Superior: </label>
            <Field name="superior" id="superior" component="select">
              <option />
              {
                superiorCandidates.map((candidate, i) => {
                  return (
                    <option key={i} value={candidate.id}> { candidate.name } </option>
                  )
                })
              }
            </Field>
        </div>
      </div>
    </form>
  )
}

const myValidator = values => {
  const errors = {};
  if (!values.name) {
    errors.name = "Name is required";
  }
  if (!values.rank) {
    errors.rank = "Rank is required";
  }
  if (!values.sex) {
    errors.sex = "Sex is required";
  }
  if (!values.startDate) {
    errors.startDate = "StartDate is required";
  } //need regex check
  if (!values.phone) {
    errors.phone = "Phone is required";
  } //need regex check
  if (!values.email) {
    errors.email = 'An email is required';
  } else if (!/(.+)@(.+){1,}\.(.+){1,}/i.test(values.email)) {
    // use a more robust RegEx in real-life scenarios
    errors.email = 'Valid email is required';
  }
  return errors;
};

const newField = ({
  input,
  type,
  placeholder,
  id,
  meta: { touched, error },
  ...rest
}) => {
  return (
    <div>
      <input {...input} placeholder={placeholder} type={type} id={id} />
      {touched && error && <p style={{ color: 'red' }}>{error}</p>}
    </div>
  );
};

SoldierForm = reduxForm({
  form: 'soldier',
  validate: myValidator,
  enableReinitialize: true
})(SoldierForm)

SoldierForm = connect(
  state => ({
    initialValues: state.soldiers.editingSoldier ? state.soldiers.editingSoldier : []
  })
)(SoldierForm)

const rankOptions = ["General", "Colonel", "Major", "Captain", "Lieutenant", "Warrant Officer",
"Sergeant", "Corporal", "Specialist", "Private"];
export default SoldierForm;

