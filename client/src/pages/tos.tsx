import { Link } from "wouter";
import FullHouseLogo from "@/components/FullHouseLogo";
import { Badge } from "@/components/ui/badge";

const summaryPoints = [
  "We are in beta. One of our team members manually reviews images before delivery.",
  "Furnished images are delivered by email, typically within 24 hours.",
  "You are responsible for how staged photos are used in listings. If a listing misrepresents a home, liability is on the realtor, not us.",
  "You affirm you own the images you upload or have permission to use them; we are not liable for misuse.",
  "You own your images; we may use them for marketing and product improvement unless you opt out in writing.",
  "We may use User Data broadly for analytics, product improvement, operations, and marketing as described below.",
];

const sections = [
  {
    title: "Terms Of Service",
    body: [
      "Last updated: January 27th, 2025",
      "These terms of use (\"Terms of Use\"), together with any other agreements or terms incorporated by reference, including our Privacy Policy (available at https://www.applydesign.io/pp) (the \"Privacy Policy\") (collectively, the \"Terms\") set forth the basis on which you are permitted to access and use the website available at https://applydesign.io, and associated services (the \"Platform\"), provided to you by Clone.SpaceLtd. (\"we\" or \"Company\").",
      "These Terms constitute a binding and enforceable legal contract between Company and You. By using the Services, you agree to these Terms. If you are entering into these Terms on behalf of a company or another legal entity, you represent that you have the authority to bind such entity and its affiliates, in which case the term \"You\" will refer to an individual or such entity and its affiliates. If the legal entity that you represent does not agree with these Terms, you must not accept these Terms or use the Services.",
    ],
  },
  {
    title: "Definitions",
    body: [
      "\"Account\" means an online account registered by you for the purpose of using the Services.",
      "\"Services\" means any applications, products, services, documentation, and software made available through the Platform.",
      "\"User Data\" means data relating to your use of the Platform and Services, including but not limited to information related to photos and any additional information obtained by or provided through the Service; settings, preferences chosen, and resource usage; free text and/or any other content submitted by you.",
    ],
  },
  {
    title: "The Services",
    body: [
      "The Services offer a comprehensive platform enabling users with registered Accounts on the Platform to upload photographs (\"Photos\"). Utilizing the Company's virtual staging software, you can stage, decorate, furnish, and export modified, high resolution images (the \"Modified Works\").",
      "We may update the Services from time to time, including adding or removing functions.",
    ],
  },
  {
    title: "Apply Coins",
    body: [
      "Apply Coins: You have the ability to purchase apply coins through the Platform, which can be used to access various features, services, and functionalities offered by the Company (\"Apply Coin\").",
      "Purchase and Use of Apply Coins: Apply Coins can be purchased directly through the Platform using the payment methods accepted by the Company. Once purchased, Apply Coins are credited to your Account and can be used to enhance your experience on the Platform.",
      "Apply Coin Expiration: Apply Coins are valid for a period of 1 year from the date of purchase. After this period, any unused Apply Coins will automatically expire. Expired Apply Coins cannot be redeemed, refunded, or exchanged for any form of credit or cash equivalent.",
      "Notification of Expiration: The Company may, but is not obligated to, provide reminders or notifications to you regarding the approaching expiration of your Apply Coins. It is your responsibility to monitor the status of your Apply Coins and ensure they are used within the validity period.",
      "Non-Transferability: Apply Coins are non-transferable and must be used solely by the Account holder who purchased them. You are prohibited from selling, transferring, or otherwise distributing Apply Coins to other parties.",
      "No Refunds: Purchases of Apply Coins are final and non-refundable following thirty (30) days from the date of purchase, all in accordance with these Terms and applicable law.",
    ],
  },
  {
    title: "Registration and User Account",
    body: [
      "Establishing an Account: In order to use the Platform, you must complete the registration process by providing current, complete and accurate information as prompted by the applicable registration form and must keep all information in your Account, including email address, up to date.",
      "Account Information: You must safeguard and not disclose your Account username and password and you must supervise the use of such Account. You must provide us accurate and complete information in order to create an Account. You agree to keep your Account information up to date and accurate. You are solely and fully responsible for maintaining the confidentiality of the account usernames and passwords. You are solely and fully responsible for all activities that occur under the account. You must notify us immediately of any unauthorized use of your Account or any other breach of security.",
      "Deletion of Account: You may delete your Account at any time. Any information and data entered into the Services may be permanently deleted if you delete the Account, provided we may retain certain information as required to comply with our legal obligations, resolve disputes and enforce our agreements (unless we are instructed otherwise).",
    ],
  },
  {
    title: "Use of Data",
    body: [
      "Company may collect User Data, and you hereby grant Company permission to collect User Data available on the Platform and to use such User Data to improve the Platform performance and functionality and improve services and support to Company users and for other business purposes including monitoring, statistical data gathering, diagnostics, comparative analyses, press and supplies utilization, complementary solutions usage, security and software integrity assurance, remote control and support and click performance tracking and billing.",
      "Company may use various analytics tools in performing the above. Company does not provide an opt-out option from the use of such analytics tools and therefore you should refrain from registering for the Service if you do not agree to the use of analytics tools in connection with the User Data. Where applicable, User Data collected by Company will be shared with you or any service provider who may provide you with supplementary services in connection with the Services. Company may further use User Data as set forth in its privacy policy referenced above.",
      "Return Policy: All purchases made on the Platform are non-cancellable and non-refundable.",
    ],
  },
  {
    title: "User Obligations and Restrictions",
    body: [
      "Obligations: In connection with your use of the Services you agree to comply with all applicable laws, rules and regulations, including those regarding data privacy and intellectual property rights.",
      "License: By uploading Photo to the Platform or otherwise using the Services, you grant us a worldwide, non-exclusive license to host, copy and use your Photos, the Modified Works, your User Data and any additional information or data provided by you in order to provide you with the Services. Subject to this limited license we do not acquire any right in your data and you or your licensors retain all rights and ownership to your data.",
      "Restrictions: You must not misuse the Services. For example, you may not, whether by yourself or anyone on your behalf (a) sell, resell, or lease the Services or access or attempt to access the Services by any means other than the interface we provided or authorized; (b) circumvent any access or use restrictions put into place to prevent certain uses of the Services; (c) use the Services to store, share or transmit content which is unlawful, infringing, harmful or which violates any person's rights, including privacy rights and intellectual property rights; (d) attempt to disable, impair, or destroy the Services, or Platform; or (e) reverse engineer or decompile the Services, attempt to do so, or assist anyone in doing so.",
      "The Photos: You agree that you will not upload, share, or otherwise distribute Photos, which: (i) are unlawful, threatening, abusive, harrying, defamatory, libelous, deceptive, fraudulent, invasive of another's privacy or impersonate another person; (ii) contain explicit or graphic descriptions or accounts of sexual acts or in any way violate child pornography laws; (iii) contain software viruses or other harmful computer code, files or programs that are designed or intended to disrupt, damage, or limit the functioning of any software, hardware or telecommunications equipment or to damage or obtain unauthorized access to any data or other information of any third party.",
    ],
  },
  {
    title: "Intellectual Property Rights",
    body: [
      "Retention of Rights: All rights not expressly granted to you under these Terms are reserved by Company. We reserve all rights, title and interest to the Services, the Platform and any of their related intellectual property rights. The Terms do not convey to you an interest in or to Company's intellectual property rights. Nothing in the Terms constitutes a waiver of Company's Intellectual Property Rights under any law.",
      "You retain any and all rights you hold with respect to the Photos. Photos may be protected by copyright, even if not marked with the copyright symbol. If you are not the owner of the Photos, then you must obtain authorization from the owner of the Photo or the copyright holder in order to use the Photo with the Services.",
      "Feedback: To the extent you provide us any feedback, comments or suggestions (\"Feedback\"), you grant us a royalty-free, fully paid up, worldwide, perpetual and irrevocable license to incorporate the Feedback into the Services or any of our current or future products or services.",
    ],
  },
  {
    title: "Disclaimers of Warranties",
    body: [
      "Security measures have been implemented to ensure the safety and integrity of the Services. However, despite this, information that is transmitted over the Internet may be susceptible to unlawful access and monitoring. Company gives no guarantee of any kind concerning the content on our Services.",
      "The Services are provided on an \"as is\" and \"as available\" basis, and Company disclaims all warranties of any kind, express, implied or statutory, including but not limited to reliability of service, warranties of non-infringement or implied warranties of use, merchantability or fitness for a particular purpose or use. We disclaim all liability and any obligations for any harm or damage caused by any third party hosting providers.",
      "Other than as expressly stated in the Terms we do not warrant that the Services will be secure, uninterrupted, without error, or free of defects.",
    ],
  },
  {
    title: "Limitation of Liability",
    body: [
      "In no event will Company be liable for (i) incidental, special, indirect, or consequential damages or (ii) loss of profits or revenue, loss of data, business interruption, loss of Apply Coins, including due to expiration, or loss of goodwill, in each case arising out of or related to your use or inability to use the Services, however caused, regardless of the theory of liability (contract, tort, or otherwise) and even if Company has been advised of the possibility of such damages.",
      "In no event will Company's total liability to you for all damages arising out of or related to these Terms or to the Platform or Services exceed an amount of US$100.00.",
      "These limitations will not apply to the extent prohibited by law.",
    ],
  },
  {
    title: "Term and Termination",
    body: [
      "Term: These Terms commence on the date you first accept them and will remain in effect until these Terms are terminated.",
      "Termination: You may stop using the Services at any time and you may delete your Account. We may suspend or terminate your access to the Services at any time at our discretion and without notice if you do not comply with these Terms. If you terminate your Account, your data will be removed from the Service, however, deletion may not be immediate and Company may continue keeping your personal information in its records for audits and other administrative purposes.",
      "Survival: The provisions of these Terms that, by their nature and content, must survive the termination of these Terms in order to achieve the fundamental purposes of these Terms shall so survive. Without limiting the generality of the foregoing, the Intellectual Property Rights, Disclaimers of Warranties, Limitation of Liability, Governing Law and Jurisdiction and General sections, will survive the termination or expiration of the Terms.",
    ],
  },
  {
    title: "General",
    body: [
      "Governing Law and Jurisdiction: These Terms are governed by the laws of the State of Israel excluding rules as to choice and conflicts of law and the courts in the Tel Aviv, Israel will have exclusive jurisdiction; however, Company or its Affiliate may bring suit for payment in the country where your entity is located. You and Company agree that the United Nations Convention on Contracts for the International Sale of Goods will not apply.",
      "Changes to Terms: Company may change the Terms from time to time, and such change will become effective upon the date on which it is posted on the Platform. You are responsible for checking the Platform regularly for such changes. By continuing to access or use the Services you agree to be bound by the revised Terms.",
      "Severability: If any part of these Terms is deemed unlawful, void or for any reason unenforceable, then that provision shall be deemed to be severable from the rest of these Terms and shall not affect the validity and enforceability of any of the remaining provisions of these Terms. In such cases, the part deemed invalid or unenforceable shall be construed in a manner consistent with applicable law to reflect, as closely as possible, the original intent of the parties.",
      "Waiver: No waiver by us of a breach of any of the provisions of terms of these Terms shall be construed as a waiver of any preceding or succeeding breach of any of the provisions of these Terms.",
      "Relationship: Nothing in these Terms shall be construed as creating any agency, partnership, trust arrangement, fiduciary relationship or any other form of joint enterprise between you and Company.",
      "Entire Agreement: These Terms contain the entire agreement between Company and you relating to your use of the Services and supersedes any and all prior agreements between Company and you in relation to the same. You confirm that, in agreeing to accept these Terms, you have not relied on any representation except as has expressly been made by Company in these Terms.",
      "Assignment: You may not assign your rights or delegate your obligations under these Terms without Company's prior written consent. Any purported assignment contrary to this section will be null and void. Company may assign its obligations hereunder.",
      "No Third Party Rights: There are no third-party beneficiaries to these Terms.",
    ],
  },
];

export default function TermsOfService() {
  return (
    <div className="min-h-screen bg-background">
      <header className="border-b border-border/60 bg-background/95">
        <div className="max-w-5xl mx-auto px-4 py-4 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2 text-sm font-semibold text-foreground">
            <FullHouseLogo className="h-6 w-6 text-primary" />
            <span>Staging Equation</span>
          </Link>
          <Link href="/" className="text-sm text-muted-foreground hover:text-foreground transition">
            Back to home
          </Link>
        </div>
      </header>

      <main className="max-w-5xl mx-auto px-4 py-12 space-y-10">
        <div className="space-y-4">
          <Badge variant="outline" className="border-primary/20 text-primary w-fit">
            Terms Of Service
          </Badge>
          <h1 className="text-3xl sm:text-4xl font-bold tracking-tight">Terms Of Service</h1>
          <p className="text-muted-foreground">
            Read this carefully before using the platform. For more details, see{" "}
            <a
              href="https://www.applydesign.io/tos"
              className="text-primary underline underline-offset-4"
              target="_blank"
              rel="noreferrer"
            >
              applydesign.io/tos
            </a>
            .
          </p>
        </div>

        <section className="rounded-2xl border border-primary/10 bg-white/90 p-6 shadow-[0_18px_40px_rgba(91,76,255,0.08)]">
          <h2 className="text-lg font-semibold">Summary</h2>
          <ul className="mt-4 space-y-2 text-sm text-muted-foreground">
            {summaryPoints.map((point) => (
              <li key={point} className="flex gap-2">
                <span className="text-primary">-</span>
                <span>{point}</span>
              </li>
            ))}
          </ul>
        </section>

        <div className="space-y-8">
          {sections.map((section) => (
            <section key={section.title} className="space-y-3">
              <h2 className="text-xl font-semibold">{section.title}</h2>
              {section.body.map((paragraph) => (
                <p key={paragraph} className="text-sm text-muted-foreground leading-relaxed">
                  {paragraph}
                </p>
              ))}
            </section>
          ))}
        </div>
      </main>
    </div>
  );
}
