import React from 'react';
import './CustomerHelpCenter.css'; 
function CustomerHelpCenter() {
  return (
    <div className="help-center-container">
      <div className="help-center-header">
        <h1>Welcome to Customer Help Center</h1>
        <p>
          If you need any assistance or have any questions, feel free to reach out to us.
          Our dedicated support team is here to help you.
        </p>
      </div>

      <div className="help-center-main">
        <section className="help-section">
          <h2>How Can We Assist You?</h2>
          <ul>
            <li>
              <strong>FAQs:</strong> Check our frequently asked questions for quick answers.
            </li>
            <li>
              <strong>Contact Us:</strong> Reach out to us via email or phone for personalized assistance.
            </li>
            <li>
              <strong>Feedback:</strong> We value your feedback. Let us know how we can improve our service.
            </li>
          </ul>
        </section>

        <section className="additional-info-section">
          <h2>Additional Information</h2>
          <p>
            Here you can find additional resources and information that may help you:
          </p>
          <ul>
            <li>Product manuals and guides</li>
            <li>Service updates and announcements</li>
            <li>Troubleshooting tips and techniques</li>
          </ul>
        </section>
      </div>
    </div>
  );
}

export default CustomerHelpCenter;
