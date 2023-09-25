"use client";

import StorefrontNavBar from "@/modules/lib/components/nav-bar/StorefrontNavBar";
import React, { useState } from "react";
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

const Charts = () => {
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
        data: [65, 59, 80, 81, 56, 55, 40],
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
                  return value + " K";
                }
              },
            },
            x: {
                grid: { display: false },
              },
          }
      };
    
    return (
        <div className="">
            <div className="flex py-10 text-20 weight-400 text-dimgrey opacity-70 gap-40 border-b border-1 border-lighter-grey">
                <div>Week</div>
                <div>Month</div>
                <div>Year</div>
                <div>All Time</div>
            </div>
            <div className="py-25">
                <div className="flex space-between py-5 text-16 weight-400 text-dimgrey opacity-70">
                    <div>May 15th, 2023</div>
                    <div>Products sold</div>
                </div>
                <div className="flex space-between py-7 text-30 weight-700 text-black">
                    <div>NGN 58,720</div>
                    <div>78</div>
                </div>
            </div>
           <Bar data={data} options={option} />
        </div>

    );
};

export default Charts;
