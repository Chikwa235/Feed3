import React from 'react';

const NGOCard = ({ name, email, website }) => {
  return (
    <div className="ngo-card">
      <strong>{name}</strong><br />
      {email && <span>Email: <a href={`mailto:${email}`}>{email}</a><br /></span>}
      {website && <span>Website: <a href={website} target="_blank" rel="noopener noreferrer">{website}</a></span>}
    </div>
  );
};

export default NGOCard;