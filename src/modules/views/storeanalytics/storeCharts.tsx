"use client";

import StorefrontNavBar from "@/modules/lib/components/nav-bar/StorefrontNavBar";
import React, { useState } from "react";
import cx from "classnames";

import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    BarElement,
    Title,
    Tooltip,
    Legend,
  } from 'chart.js';
import { Bar } from "react-chartjs-2";

const tabs = [
 'Week', 'Month', 'Year', 'All Time'
];

const Charts = () => {
  const [activeTab, setActiveTab] = useState(tabs[0]);
    ChartJS.register(
        CategoryScale,
        LinearScale,
        BarElement,
        Title,
        Tooltip,
        Legend
      );

    const labels = ['Sun', 'Mon', 'Tue', 'Wed', 'Thur', 'Fri', 'Sat'];
    const data = {
    labels: labels,
    datasets: [{
        data: [20, 50, 20, 11, 26, 15, 40],
        backgroundColor: [
            'rgba(11, 147, 120, 0.49)'
        ],
        borderColor: [
        'rgba(217, 217, 217, 0.70)',
        ],
        borderWidth: 1
    }]
    };

    const option = {
        scales: {
            y: {
              beginAtZero: true,
              ticks: {
                callback: function (value: any, index: any, values: any) {
                  return value + " K  ";
                },
                font: {
                  size: 16,
                },
                color: 'rgba(51, 51, 51, 0.70)',
              },
              border:{
                display:false
              }
              
            },
            x: {
                grid: { display: false },
                ticks: {
                  font: {
                    size: 16,
                  },
                  color: 'rgba(51, 51, 51, 0.70)',
                },
                border:{
                  display:false
                }
              },
          }
      };
    
    return (
      <div className="">
          <div className="flex text-16 weight-400 text-dimgrey opacity-70 border-b border-1 border-lighter-grey">
              {tabs.map((tab) => (
                  <div
                      onClick={() => setActiveTab(tab)}
                      className={cx(
                        "py-8 px-16 pointer",
                          {
                              "text-black border-b border-3 border-black": tab == activeTab,
                          }
                      )}
                  >
                      {tab}
                  </div>
              ))}
          </div>
          <div className="py-25">
              <div className="flex space-between py-5 text-14 weight-400 text-dimgrey opacity-70">
                  <div>May 15th, 2023</div>
                  <div>Products sold</div>
              </div>
              <div className="flex space-between py-7 text-18 weight-700 text-black">
                  <div>NGN 58,720</div>
                  <div>78</div>
              </div>
          </div>
          <Bar data={data} options={option} />
      </div>

    );
};

export default Charts;
