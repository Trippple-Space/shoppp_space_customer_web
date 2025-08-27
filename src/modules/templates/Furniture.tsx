"use client"

import { useState } from "react";
import "./styles/furniture.css";

const Furniture = () => {
    const [showMobileNav, setShowMobileNav] = useState(false);

    return (
        <div>
            <header>
                <nav className="flex">
                    <div id="icon-navs" className="flex">
                        <a href="#">
                            <img src="/images/hero/logo.png" alt="logo" id="nav-logo" />
                        </a>
                        <div id="nav-items-container" className="flex">
                            <ul id="nav-items" className="flex">
                                <li className="nav-item">
                                    <p className="flex">
                                        <span>Category</span>
                                        <img src="/images/hero/down.png" alt="caret-down-icon" />
                                    </p>
                                    <div id="nav-catergory-list">
                                        <ul>
                                            <li>cat 1</li>
                                            <li>cat 2</li>
                                            <li>cat 3</li>
                                        </ul>
                                    </div>
                                </li>
                                <li className="nav-item"><a href="#">Promo</a></li>
                                <li className="nav-item"><a href="#">Interior design</a></li>
                                <li className="nav-item"><a href="#">Product recommendation</a></li>
                            </ul>
                        </div>
                    </div>

                    <div id="search-icons" className="flex">
                        <div id="search-box" className="flex">
                            <img src="/images/hero/search.png" alt="search-icon" />
                            <img src="/images/hero/search-black.svg" alt="search-icon" />
                            <input type="text" name="search" id="search" placeholder="Product Search" />
                        </div>
                        <div id="user-icons" className="flex">
                            <a href="#" id="cartIcon">
                                <img className="user-icon" src="/images/hero/shopping-cart.svg" alt="cart-icon" />
                            </a>
                            <a href="#">
                                <img className="user-icon" src="/images/hero/heart.svg" alt="fav-icon" />
                            </a>
                            <a href="#">
                                <img className="user-icon" src="/images/hero/user.svg" alt="user-icon" />
                            </a>
                            <img
                                className="user-icon"
                                id="menu-icon"
                                src="/images/hero/menu.svg"
                                alt="menu-icon"
                                onClick={() => setShowMobileNav(true)}
                            />
                        </div>
                    </div>
                </nav>

                <div id="hero-section">
                    <div id="hero-texts-container">
                        <div id="hero-texts">
                            <h1>Discover elegant & affordable furniture for every room</h1>
                            <p>
                                Transform your furniture with sophisticated and stylish pieces,
                                and create a serene inviting home
                            </p>
                        </div>
                    </div>

                    <div id="ctas" className="flex">
                        <a href="#">
                            <button type="button" className="hero-cta" id="shop-now">Shop now</button>
                        </a>
                        <div className="other-offers flex">
                            <button type="button" className="hero-cta flex" id="free-delivery">
                                <img src="/images/hero/delivery.png" alt="delivery-truck-icon" />
                                <span>Free delivery</span>
                            </button>
                            <button type="button" className="hero-cta flex" id="time">
                                <img src="/images/hero/time.png" alt="clock-icon" />
                                <span>Always on-time</span>
                            </button>
                        </div>
                    </div>

                    <div id="hero-images-container">
                        <div id="hero-images">
                            <img className="hero-image" id="hero-image1" src="/images/hero/cushion.jpg" alt="chair" />
                            <img className="hero-image" id="hero-image2" src="/images/hero/flower-table.jpg" alt="flower" />

                            <div className="hero-image" id="hero-image3">
                                <img src="/images/hero/manager.jpg" alt="manager" />
                                <div id="agentInfo">
                                    <span>Nico Wiliams Jr</span>
                                    <span>Agent property</span>
                                </div>
                            </div>

                            <div className="hero-image flex" id="hero-image4">
                                <div id="hero-image-users-images" className="flex">
                                    <div><img src="/images/hero/woman.jpg" alt="user" /></div>
                                    <div><img src="/images/hero/man.jpg" alt="user" /></div>
                                    <div><img src="/images/hero/woman2.jpg" alt="user" /></div>
                                </div>
                                <p id="items-sold">
                                    <span>120,000 +</span>
                                    <span>Items sold out</span>
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </header>

            <div id="mobile-nav-backdrop" className={showMobileNav ? "showNav" : ""}>
                <nav id="mobile-nav">
                    <div id="x-container" className="flex">
                        <img
                            className="user-icon"
                            id="close-icon"
                            src="/images/hero/x.svg"
                            alt="close-icon"
                            onClick={() => setShowMobileNav(false)}
                        />
                    </div>
                    <div>
                        <div id="mobile-search-box" className="flex">
                            <img src="/images/hero/search.png" alt="search-icon" />
                            <input type="text" name="search" id="search2" placeholder="Product Search" />
                        </div>
                    </div>

                    <div id="link-lists">
                        <ul id="nav-items">
                            <li className="nav-item">
                                <p className="flex">
                                    <span>Category</span>
                                    <img src="/images/hero/down.png" alt="caret-down-icon" />
                                </p>
                                <div id="nav-catergory-list">
                                    <ul>
                                        <li>cat 1</li>
                                        <li>cat 2</li>
                                        <li>cat 3</li>
                                    </ul>
                                </div>
                            </li>
                            <li className="nav-item"><a href="#">Promo</a></li>
                            <li className="nav-item"><a href="#">Interior design</a></li>
                            <li className="nav-item"><a href="#">Product recommendation</a></li>
                        </ul>
                        <ul id="user-action-list">
                            <li className="flex">
                                <a href="#" className="flex">
                                    <img className="user-icon" src="/images/hero/shopping-cart.svg" alt="cart-icon" />
                                    <span>Cart</span>
                                </a>
                            </li>
                            <li className="flex">
                                <a href="#" className="flex">
                                    <img className="user-icon" src="/images/hero/heart.svg" alt="fav-icon" />
                                    <span>Favorites</span>
                                </a>
                            </li>
                            <li className="flex">
                                <a href="#" className="flex">
                                    <img className="user-icon" src="/images/hero/user.svg" alt="user-icon" />
                                    <span>Profile</span>
                                </a>
                            </li>
                        </ul>
                    </div>
                </nav>
            </div>

            <section id="popular-section">
                <div id="popular-headings">
                    <h3>Popular</h3>
                    <h2>furniture sale now on!</h2>
                </div>
            </section>
        </div>
    );
};

export default Furniture;