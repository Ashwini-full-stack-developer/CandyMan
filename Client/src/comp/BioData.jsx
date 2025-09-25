import React from 'react'

export default function BioData() {
  return (
    <div className="companyForm">
        <h2>Add New Company</h2>
        {message && <p>{message}</p>}
        <form onSubmit={handleCompanySubmit}>
            <input type="text" name="CompanyName" placeholder="Company Name" onChange={handleCompanyInputChange} required />
            <input type="text" name="HeadQuatrous" placeholder="Headquarters" onChange={handleCompanyInputChange} required />
            <input type="file" accept="image/*" onChange={handleCompanyImageChange} />
            <button type="submit">Submit</button>
        </form>
    </div>
  )
}
