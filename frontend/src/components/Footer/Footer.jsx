import React from 'react'
import './Footer.css'
import { assets } from '../../assets/frontend_assets/assets'

const Footer = () => {
    return (
        <div className='footer' id='footer'>
            <div className="footer-content">
                <div className="footer-content-left">
                       <img className='logo' src={assets.logo} alt="" />
                       <p>"SpiceCart – Bringing Flavor to Your Doorstep!"</p>
                       <div className="footer-social-icons">
                          <img src={assets.facebook_icon} alt="" />
                          <img src={assets.twitter_icon} alt="" />
                          <img src={assets.linkedin_icon} alt="" />
                       </div>
                </div>
                <div className="footer-content-centre">
                     <h2>Company</h2>
                     <ul>
                        <li>Home</li>
                        <li>About Us</li>
                        <li>Delivery</li>
                        <li>Privacy Policy</li>
                     </ul>
                </div>
                <div className="footer-content-right">
                     <h2>GET IN TOUCH</h2>
                     <ul>
                        <li>spicecart@gmail.com</li>
                        <li>varunsharma24025@gmail.com</li>
                     </ul>
                </div>
            </div>
            <hr />
            <p className="footer-copyright">
                Copyright 2025 © SpiceCart.com - All Right Reserved.
            </p>
        </div>
    )
}

export default Footer