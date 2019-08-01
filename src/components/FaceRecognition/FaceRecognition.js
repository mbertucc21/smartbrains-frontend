import React from 'react';
import './FaceRecognition.css'

const FaceRecognition = ({ numFaces, imageUrl, box }) => {
  var boxes = [];
  for (var i=0; i<numFaces; i++){
    boxes.push(<div key={i} className='bounding-box' style={{top: box[i].topRow, right: box[i].rightCol, bottom: box[i].bottomRow, left: box[i].leftCol}}></div>)
  }

  return (
    <div className='center ma'>
      <div className='absolute mt2'>
        <img id='inputImage' src={imageUrl} alt='' width='300px' height='auto' />
        <div>
          {boxes}
        </div>
      </div>
    </div>
  );
}

export default FaceRecognition
