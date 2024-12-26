import { collection, getDocs } from "firebase/firestore";
import { db } from "../firebase"; // Firestore bağlantısını çağırıyoruz

/**
 * Firestore'dan kılavuzları çeken işlev
 * @returns {Promise<Object>} Tüm kılavuzları döner
 */
export const fetchGuidelines = async () => {
    const guidelinesRef = collection(db, "kilavuzlar");
    const snapshot = await getDocs(guidelinesRef);
    const guidelines = {};

    snapshot.forEach((doc) => {
        const [key, guidelineType] = doc.id.split("_"); // Örneğin: IgA_ap -> [IgA, ap]
        if (!guidelines[guidelineType]) guidelines[guidelineType] = {};
        if (!guidelines[guidelineType][key]) guidelines[guidelineType][key] = [];
        guidelines[guidelineType][key].push(doc.data());
    });

    console.log("Firestore'dan gelen kılavuzlar:", guidelines);
    return guidelines; // { ap: { IgA: [...], IgM: [...] }, cilv: { IgA: [...], ... } }
};
