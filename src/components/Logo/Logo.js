import React from 'react';
import Tilt from 'react-tilt';
import './Logo.css';
import ai from './ai.png'
// Icons made by <a href="https://www.flaticon.com/authors/photo3idea-studio" title="photo3idea_studio">photo3idea_studio</a> from <a href="https://www.flaticon.com/"                 title="Flaticon">www.flaticon.com</a> is licensed by <a href="http://creativecommons.org/licenses/by/3.0/"                 title="Creative Commons BY 3.0" target="_blank">CC 3.0 BY</a>

const Logo = () => {
  return (
    <div className='ma4 mt0'>
      <Tilt className="Tilt br2 shadow-2" options={{ max : 55 }} style={{ height: 100, width: 100 }} >
       <div className="Tilt-inner pa3"><img src={ai} alt='logo'/></div>
      </Tilt>
    </div>
  );
}

export default Logo
