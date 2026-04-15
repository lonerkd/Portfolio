import React, { useEffect, useState } from 'react';
import { motion, useSpring, useTransform } from 'framer-motion';

/* ══════════════════════════════════════
   PhotoField — fixed full-page parallax photo background
   Spans the entire site, grid-distributed so photos
   don't cluster. Reacts to mouse position.
   ══════════════════════════════════════ */

const IMG = (id, w = 400) => `https://lh3.googleusercontent.com/d/${id}=w${w}`;

// Shuffled for variety — no similar photos adjacent
const PHOTOS = [
  '1tVlWzEhbkik6Xxk90X1ra_FmZR9VMCAf',
  '1QvTjsBw-UHstHFVVrRAkehxzIx-eGEgZ',
  '1xFFHMEpKQRMbSOewkw3aZy-IWaVH1OoQ',
  '1dDVuqIKdbvUhMqnj8sjHdK_VYS0_C6Ui',
  '1SNR9x1kdHAGxG4sSf0JQNw9hpkhk9o0C',
  '1wHB3MHF1C_oaU7E5sN84mXeH2IjK17eQ',
  '1hqxnx3MQVi7A6EllAeUWYljNxwUHxI49',
  '1UcdpkhuMuA5df6ZZ1ZbsHi5jZoEAU9Sk',
  '1OFCGZWLgcX5n1FkZ8JFoHawYakjf-K2Y',
  '1m9vSaWclI0qpkaolzJf1BIyadOYWU3Ko',
  '1JoHf-1BK6sJ57rzYbgQyoyrp7j7X23rk',
  '1IpNQV_iqLywS4CwZj-MbfFhzzFqKq8Uw',
  '1v6kGMbPNcELJ6m-cHwBUVc5FWfR80oaD',
  '1E_vf5yeYCtRaB8CMGIrkJu5zBNT-MRLO',
  '1owmYc9lTuoas80z6uX68Zh5gjWc_HFzm',
  '1tfFCE5ORbHwHb_HFIS3SeYGoXcQRpdfS',
  '1KwIxNlnl2vUuH6Wo57LToYa2b9Sj7Bhm',
  '1wcmVwR9mWMHv9WP9nWHBX9RpI5rPjXge',
  '1VRjE0VIvLoDaOdGfPAvx8Z_5NRlzxutw',
  '1s8gA48BIhJddg-Mk2Ns_bfjb0rP5l6v5',
  '1_nlR0Yb0E-wYlE_-byVDt3nu1w_OJ_Pi',
  '1_YhQ-VxITvZ_XWRQ_UMwhmMN5YNU_1nD',
  '1CfevkaSmrmpUEaetdGnM8quZAQBV6fLB',
  '1iknUEH6srEtmHyJ4JZVVjU0t-R8l3Sze',
  '1d73j2enoH-IkFGAXRG6JsX1lK2N_tWP4',
  '1GuvBsMJ80PCEgGlhFwHerkgxJPHXgmIT',
  '13-KoJjPnW4r4sIV7LjfUOMuTvMh_tpWV',
  '1vo2E90SI4CBo0A3EmGPmd-vPkc4cDzCm',
  '1QAY4u44Ltse_FSbtj2lvSnxXon0yg0Wj',
  '1Quwts5Lrg1rHZn-whJLkm2T_MoWTPBDB',
  '1ILTYjQTcZrHA5jXsWOcLcUVvHRUxf5_G',
  '124P4ZdzSU_ow_CeafQjuCuLXU5kZ_sZx',
  '1M7Sppe-rL4aTUl5GxvcvDOMWMTDZMi9b',
  '1CVqpX_9p9gZmVAMZmOWIcm6mZfc3kPwA',
  '1OgjJq4ntvzO7XGicNiZtq49VoegdbED5',
  '1-z_F6Hh6aWucEklqNMhQx2LRriEelBMg',
  '1x8Rx9QbaM99_KZ5TnkRS9-59eqQxlWyG',
  '1gzV0QORGu-WvgDMwWiqF3o6bDOGxGirE',
  '1vEdEC8tQH07U-xHAaWfs__Ielw_cDjQj',
  '1Aepa5uqFy_zmOw27sCy_6yCKML52G30y',
  '1eO_nfq1A4ZvjHkJWeCPaRPkJXWYRWExV',
  '1VKzGRHR5grAUHdmoY4vPtNluVSKJuDm2',
  '17AlppMeCPngBkwMGDYnpirQ4HxxsJ0Cl',
  '1iBzF_Ytzfh3XJo2vlsu_BNfndrm5sTgE',
  '1Z1wyVtOuV9tvG09SRTN8mLpN3In_sSyc',
  '1WPJSt8J0lw5-LN9zzEDWkZQz7dJNAzdI',
  '1GpjLJ_yeN8RZl0tvGod4s1GaOHKkmI_c',
  '1z-AE3G5HElOKPx90H-MnjraJydEFfXYF',
  '1ufKtiwg02EV539ODLXExlFoaY2fOnChL',
  '1j-cacRyIdUDq_RHXCtQG--oIGV2UkXfY',
  '1CQscxdu54rzFbUnEp6deRxLkhX9SJrn1',
  '18-TeqGt-6d4dfll9iyyP9sMnHle4b37K',
  '1nPK5xeo2eQtIsOT2gI9ElrAqsML_5tdn',
  '1e-gN_E23X7PsgdC46t7cIvMpyCyF7ycU',
  '1c_R6t5XKc1_HUxGlpSJnGVjvoTkk2MG8',
  '1XOYt8xvOvnnuJFoF0FHpwMnBhLRs0Gtc',
  '1Tw3aX8wrW_OVh_zTumR8XXJmMK7efl8L',
  '1H6DDmPrMGM-ltuTGsVZC482R-Gxm1Pvv',
  '1_VFLNBVHg3yOkxlKG-X5LNEXTLSbP_mg',
  '1ZIzCnlWzBqQPtOMnkRC1AYYcy32UwSRw',
  '1D-Y0pAfR5U5zfJWh9AxyNkcT_kMTGmPi',
  '1BiYMJygJ6IpnPhoP0y_XGkhtF-2sU8SC',
  '1dtHR8xNV6c2Ap4J_LP5zWg6rfR_jEzRq',
  '1EUuD6HLokHjuFQ4kxzl_C46KAHu8RFtt',
  '1rmdf7lTT5sqESynKTgUs3LG_qisZctxd',
  '1kR8_54R-rI2ezatf6dTBLea5nsbehTpW',
  '1jKbu4wouPdckhe5ZvZkTo2Jf1M8JEL6P',
  '1Ln4-lxYI7GyblT4_wt_m2E8j7hQuE2G9',
  '1dix-7qzP-g_SoxFExdxi8umReO39g6Tm',
  '1chYJxm4X4shY_OHPq5f7na72co_z8vaO',
  '1bUBxp6A5cKhZ9s9544VwklksYLPXQr6X',
  '1FNLySSunuVih4PaW9jTeChx1cDZdEXfM',
  '1oxypoRFSLHMrI8N0yWyzdRNZbc-pX08C',
  '1HfCFFKRdsN39b5Lr4dv581TOZj-BLobE',
  '13AHjSGo6U8u_xMZHgdqy1HMLrNB64PKR',
  '1U5vjuGYE08RlmSe04QMK657-YBLht4AH',
  '1pQvAnYifhYuAQ38VkCSQA_AHV6geXpsm',
  '1hMl7N5jMfEQs_tS-8kD3Zxj35NN0bYcH',
  '1rfOxvN9ma3_U3Z8D3aQAbnQcJyJR09Mk',
  '1thwuXrp_qcITKOlB6V0F5AtSnPatEBzw',
  '1LIqrIaOJwVwtViTN5a3D8Pk5b8Dm8Izo',
  '1-OGi_xmIECT4EP5SUjJ-_JzEZG4Vz2MR',
  '1pkLE02GQm3bS0gCffbHAjQXMy6TosKAK',
  '1fKjkXrPXUlgGUTREDiSG7Z43kjjxVdV2',
  '1gHeCdlcsgxFsJY4WwgU8Br-SZl_tz1IP',
  '1XldskBnYHylvXLu1Bgeaj7zsgKl7AAaQ',
  '1s_Jvg7pOvxdgNnBXY1wVVHv7XzV5XYp9',
  '10oVxhOiZUlag_syWulvZTv369E9t7B6f',
  '1DtOx7VxCUdBC44o3rEgedWyUuwCEf25p',
  '16wYnq9_OxL8PgA_g8tgTn7h2lIviTQgM',
  '1bj7Do90ybvwOcJNcNL3k4fPcmfA14ATF',
  '1f4sPQWbNGiCiZgpk85D4_-tAERQOfr13',
  '11rKGwPWuW791Nc9gRaXVjiWuDsluKMUI',
  '1JOCajNRIdTCdztBqYdPpaq6TeF6Q8Jw3',
  '1SOHLpyo65Lpx_MT8FC0r5ay4EP_q3-X1',
  '1fqqOxywLUgPwqJwWUEtjych3uc0wJqMM',
  '1_j3CG7clf1JjE1JaNBvNG0cMqhoRqkLc',
  '1fSNxxxNah51tP51xSbvn1BBl6fgCuSR4',
  '1afs3_OBj53XPp0TSepxL4KqzwB2i2bOl',
  '1_VFda-d2JiTSXnirh-dEA9XPlKqtEUG9',
  '1r_gHCAR9p5MzuAGyaNXdROPethD0XN1_',
  '16lAA8LyP83JSm5CkD288rxBz0POvmY-7',
  '1VURA8W17EGC2qtoygBQhHS5cz7G3jyVo',
  '1riVSAvxM-7osGFv6hHvQtFnKUDuz_Wr0',
  '180sxAMmOivgjyBiSHvgkg9rpyeednGOW',
  '1v6lhBZ3IDA4QB-lVDBjc03TFL3dLesmO',
  '1El_-UA4sKASYXkMpvBVuvmWTJX7tgHft',
  '1INs0yEPLzfpWtRNqs8gKA4YLR7uigplj',
  '18bLsTyNHlIB6Vv78SqF2eb4prrVMGoYO',
  '1lFvLbqoGUE5WL5xO-o70luGKZt1xeGfU',
  '1sL3gjYN-21L_PbzFWhuAC2SWwXknp3BM',
  '1P8NtgBk02QIX7TaZ3JJD3XQzU-C0R48K',
  '1r-zLP3D8F3b8CHamoqbuphrgU6Hzinvl',
  '1YMyClkz4JG-QaXoUhxVFg8gRCGNLXolA',
  '1wPLMs0-kCAEZPhj7eOpR9OQcUlc-KI05',
  '1U1RwG9UiAZvYoUlHSMluCHrjFrJ4_I02',
  '1_P7XRpC8By7sNrxkmL76otVB4yypAdei',
  '1hRxTsmDVsYWZANPvs6MPIq1pAX0I1zAR',
  '1aWk5pEw7VbEblKh9McE7lpUq7KZy6Lem',
];

function sR(s) { return () => { s = (s * 16807) % 2147483647; return (s - 1) / 2147483646; }; }

function PhotoItem({ photo, mouseX, mouseY }) {
  const x = useTransform(mouseX, [-1, 1], [-photo.px * 30, photo.px * 30]);
  const y = useTransform(mouseY, [-1, 1], [-photo.py * 20, photo.py * 20]);

  return (
    <motion.div style={{
      position: 'absolute',
      left: `${photo.left}%`, top: `${photo.top}px`,
      width: photo.w, height: photo.w * 0.65,
      zIndex: photo.z, x, y, rotate: photo.rot,
    }}>
      <div style={{
        width: '100%', height: '100%', borderRadius: 6,
        overflow: 'hidden',
        border: '1px solid rgba(255,255,255,0.05)',
        boxShadow: '0 20px 60px rgba(0,0,0,0.6)',
      }}>
        <img src={IMG(photo.id)} alt="" loading="lazy"
          style={{ width: '100%', height: '100%', objectFit: 'cover', filter: 'grayscale(0.4) contrast(1.1)' }}
          onError={e => { e.target.style.display = 'none'; }}
        />
      </div>
    </motion.div>
  );
}

export default function PhotoField() {
  const [pageHeight, setPageHeight] = useState(5000);
  const rng = sR(42);

  useEffect(() => {
    const update = () => setPageHeight(document.body.scrollHeight);
    update();
    const obs = new ResizeObserver(update);
    obs.observe(document.body);
    return () => obs.disconnect();
  }, []);

  // Grid-based distribution: divide page into rows, place 2-3 photos per row
  // This ensures even spread from top to bottom with no clustering
  const rowCount = Math.max(8, Math.floor(pageHeight / 600));
  const rowHeight = pageHeight / rowCount;

  const photos = PHOTOS.map((id, i) => {
    const row = i % rowCount;
    const colSide = i % 2 === 0; // alternate left/right sides
    return {
      id,
      left: colSide ? (rng() * 30 + 2) : (rng() * 30 + 62), // left or right side
      top: row * rowHeight + rng() * rowHeight * 0.6, // within row, some jitter
      rot: (rng() - 0.5) * 18,
      w: 70 + rng() * 90,
      z: Math.floor(rng() * 5),
      px: rng() * 0.6 + 0.2,
      py: rng() * 0.6 + 0.2,
    };
  });

  const mouseX = useSpring(0, { stiffness: 40, damping: 25 });
  const mouseY = useSpring(0, { stiffness: 40, damping: 25 });

  useEffect(() => {
    const handleMove = (e) => {
      mouseX.set((e.clientX / window.innerWidth) * 2 - 1);
      mouseY.set((e.clientY / window.innerHeight) * 2 - 1);
    };
    window.addEventListener('mousemove', handleMove, { passive: true });
    return () => window.removeEventListener('mousemove', handleMove);
  }, [mouseX, mouseY]);

  return (
    <div style={{
      position: 'absolute', top: 0, left: 0, right: 0, height: pageHeight,
      pointerEvents: 'none', zIndex: 0, overflow: 'hidden',
      opacity: 0.1,
    }}>
      {photos.map((p, i) => (
        <PhotoItem key={i} photo={p} mouseX={mouseX} mouseY={mouseY} />
      ))}
    </div>
  );
}
