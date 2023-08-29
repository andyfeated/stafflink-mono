import Image from "next/image"
import React, { useEffect, useState } from "react"

export default function Login(){

  return (
    <div style={{height: 955, display:'flex'}}>
      <div style={{width:'70%', background: 'hsla(256, 70%, 19%, 1)',  }}>
        <Image style={{ marginTop: 300, marginLeft: 500}} src="/stafflink_logo.png" alt="StaffLink Logo" width={250} height={100} />

        <p className="slogan" style={{color: 'white', marginLeft: 350, marginTop: 100, fontSize: 30}}>
          Connecting Your Workforce Seamlessly
        </p>

        <div class="custom-shape-divider-bottom-1693305756">
            <svg data-name="Layer 1" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1200 120" preserveAspectRatio="none">
                <path d="M321.39,56.44c58-10.79,114.16-30.13,172-41.86,82.39-16.72,168.19-17.73,250.45-.39C823.78,31,906.67,72,985.66,92.83c70.05,18.48,146.53,26.09,214.34,3V0H0V27.35A600.21,600.21,0,0,0,321.39,56.44Z" class="shape-fill"></path>
            </svg>
        </div>
        
      </div>

      <div style={{width:'30%', display: 'flex', justifyContent: 'center'}}>
        <div style={{ width: '80%', height: '60%', marginTop: 140}}>
          <p style={{ fontWeight: 700, fontSize: 25}}>Register Company</p>
        </div>
      </div>
    </div>
  )
}