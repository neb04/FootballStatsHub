import React from 'react'

export default function Header() {
    return (
        <header className='flex items-center justify-between gap-4 p-4 '>
            {/* anchor tags used to jump back to home route */}
            <a href="/">
                <h1 className='font-medium'>Football<span className='text-red-600 bold'> Stats</span><span className='font-medium'> Hub</span></h1>
            </a>
            
            <div className='gap-4 flex items-center'>
                <a href="https://www.google.com/" className='flex items-center gap-2 px-3 py-2 rounded-lg text-red-600 bg-white shadow-md'>
                    <p>Quit</p>
                    <i className="fa-solid"></i>
                </a>
            </div>
        </header>
    )
}
