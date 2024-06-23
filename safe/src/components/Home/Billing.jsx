import { apple, bill, google } from "../../assets";
import styles, { layout } from "../../style";

const Billing = () => (
  <section id="product" className={layout.sectionReverse}>
    <div className={layout.sectionImgReverse}>
      <img src={bill} alt="billing" className="w-[100%] h-[100%] relative z-[5]" />

      {/* gradient start */}
      <div className="absolute z-[3] -left-1/2 top-0 w-[50%] h-[50%] rounded-full white__gradient" />
      <div className="absolute z-[0] w-[50%] h-[50%] -left-1/2 bottom-0 rounded-full pink__gradient" />
      {/* gradient end */}
    </div>

    <div className={layout.sectionInfo}>
      <h2 className={styles.heading2}>
        Have total control over <br className="sm:block hidden" /> all your medical records
      </h2>
      <p className={`${styles.paragraph} max-w-[470px] mt-5`}>
  Our blockchain system empowers patients by granting them control over who can access their medical records, ensuring utmost privacy and confidentiality.
</p>

     
    </div>
  </section>
);

export default Billing;
