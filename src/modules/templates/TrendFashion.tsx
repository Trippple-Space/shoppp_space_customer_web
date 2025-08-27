"use client"

import { useState } from "react";
import "./styles/trendFashion.css";

const TrendFashion = () => {
    const [isNavOpen, setIsNavOpen] = useState(false);

    return (
        <div className="relative">
            <header>
                <section className="navbar">
                    <div className="logo-container flex">
                        <img src="/images/hero2/images/logo.png" alt="logo-img" className="logo-img" />
                        <h1 className="logo">Trend</h1>
                    </div>
                    <nav className="nav-links">
                        <a href="#">About us</a>
                        <div className="flex">
                            <span>Products</span>
                            <img src="/images/hero2/icons/chevron-down.svg" alt="down" />
                        </div>
                        <a href="#">Collection</a>
                        <a href="#">New</a>
                        <a href="#">Sales</a>
                    </nav>
                    <div className="icons flex">
                        <div className="flex notification">
                            <img src="/images/hero2/icons/bell.svg" alt="notification-icon" />
                            <span></span>
                        </div>
                        <img src="/images/hero2/icons/shopping-cart.svg" alt="cart-icon" />
                        <img
                            id="menu-icon"
                            src="/images/hero2/icons/menu.svg"
                            alt="menu-icon"
                            onClick={() => setIsNavOpen(true)}
                        />
                    </div>
                </section>

                <section className="hero">
                    <div className="hero-image">
                        <img src="/images/hero2/images/hero-model.png" alt="Fashion Model" />
                        <div className="circle-bg"></div>
                    </div>

                    <div className="hero-text">
                        <h1>Use Fashion Into Your All Collection</h1>
                        <p>
                            Shopping is a bit of a relaxing hobby for me, which is sometimes troubling.
                        </p>
                        <button>Learn More</button>
                    </div>

                    <div className="side-buttons">
                        <div className="side-button flex first">
                            <span className="side-button-img flex first">
                                <img src="/images/hero2/icons/star-solid.svg" alt="favorite" />
                            </span>
                            <span>Favourite</span>
                        </div>
                        <div className="side-button flex">
                            <span className="side-button-img flex">
                                <img src="/images/hero2/icons/heart-solid.svg" alt="popular" />
                            </span>
                            <span>Popular</span>
                        </div>
                        <div className="lifestyle-box">
                            <span className="side-button-img flex">
                                <img src="/images/hero2/icons/camera-lens-fill.svg" alt="lifestyle" />
                            </span>
                            <div>
                                <p>Lifestyle</p>
                                <span>Our brands follow process</span>
                            </div>
                            <button className="get-all">Get All</button>
                        </div>
                    </div>
                </section>
            </header>

            <section className="features">
                <div className="feature-images flex">
                    <div>
                        <img src="/images/hero2/images/woman1.jpg" alt="woman" />
                    </div>
                    <div>
                        <img src="/images/hero2/images/woman2.jpg" alt="woman" />
                    </div>
                </div>
                <div className="feature-text flex">
                    <div className="feature">
                        <h4>Quality Product</h4>
                        <p>Lorem ipsum dolor sit amet consectetur uruam.</p>
                    </div>
                    <div className="feature">
                        <h4>Best Production</h4>
                        <p>Lorem ipsum dolor sit amet consectetur uruam.</p>
                    </div>
                    <div className="feature">
                        <h4>100% Authentic</h4>
                        <p>Lorem ipsum dolor sit amet consectetur uruam.</p>
                    </div>
                </div>
            </section>

            <section className="exclusive">
                <h2>Exclusive Products</h2>
                <p>
                    Shopping is a bit of a relaxing hobby for me, which is sometimes troubling.
                </p>
            </section>

            {/*mobile-nav */}
            <div id="mobile-nav-backdrop" className={isNavOpen ? "showNav" : ""}>
                <nav id="mobile-nav">
                    <div id="x-container" className="flex">
                        <img
                            className="user-icon"
                            id="close-icon"
                            src="/images/hero2/icons/x.svg"
                            alt="close-icon"
                            onClick={() => setIsNavOpen(false)}
                        />
                    </div>

                    <div id="link-lists">
                        <ul id="nav-items">
                            <li className="nav-item"><a href="#">About us</a></li>
                            <li className="nav-item">
                                <p className="flex">
                                    <span>Products</span>
                                    <img src="/images/hero2/icons/chevron-down.svg" alt="caret-down-icon" />
                                </p>
                            </li>
                            <li className="nav-item"><a href="#">Collection</a></li>
                            <li className="nav-item"><a href="#">New</a></li>
                            <li className="nav-item"><a href="#">Sales</a></li>
                        </ul>
                        <ul id="user-action-list">
                            <li className="flex">
                                <a href="#" className="flex">
                                    <img className="user-icon" src="/images/hero2/icons/shopping-cart.svg" alt="cart-icon" />
                                    <span>Nav 1</span>
                                </a>
                            </li>
                            <li className="flex">
                                <a href="#" className="flex">
                                    <img className="user-icon" src="/images/hero2/icons/shopping-cart.svg" alt="fav-icon" />
                                    <span>Nav 2</span>
                                </a>
                            </li>
                            <li className="flex">
                                <a href="#" className="flex">
                                    <img className="user-icon" src="/images/hero2/icons/shopping-cart.svg" alt="user-icon" />
                                    <span>Nav 3</span>
                                </a>
                            </li>
                        </ul>
                    </div>
                </nav>
            </div>
        </div>
    );
};

export default TrendFashion;