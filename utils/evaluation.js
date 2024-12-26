/**
 * Değerleri kılavuzlara göre değerlendiren işlev
 * @param {number} ageMonths - Yaş (ay cinsinden)
 * @param {Object} inputValues - Adminin girdiği değerler
 * @param {Object} guidelines - Firestore'dan gelen kılavuzlar
 * @returns {Object} Tüm değerler ve tüm kılavuzlara göre değerlendirme sonuçları
 */
export const evaluateValuesByGuidelines = (ageMonths, inputValues, guidelines) => {
    const results = {};

    for (const [key, value] of Object.entries(inputValues)) {
        if (!value) continue;

        results[key] = {};

        Object.keys(guidelines).forEach((guidelineName) => {
            const guideline = guidelines[guidelineName][key];
            if (guideline) {
                const matchedRange = guideline.find(
                    (range) =>
                        ageMonths >= range.min_age_months &&
                        ageMonths <= range.max_age_months
                );

                if (matchedRange) {
                    const {
                        min_val,
                        max_val,
                        geometric_mean_min,
                        geometric_mean_max,
                        min_mean,
                        max_mean,
                        confidence_interval_min,
                        confidence_interval_max,
                    } = matchedRange;

                    let status = "";
                    if (value < min_val) {
                        status = "Düşük";
                    } else if (value > max_val) {
                        status = "Yüksek";
                    } else {
                        status = "Normal";
                    }

                    results[key][guidelineName] = {
                        status,
                        range: `${min_val} - ${max_val}`,
                        geometricMin: geometric_mean_min || "Belirtilmemiş",
                        geometricMax: geometric_mean_max || "Belirtilmemiş",
                        minMean: min_mean || "Belirtilmemiş",
                        maxMean: max_mean || "Belirtilmemiş",
                        confidenceInterval: `${confidence_interval_min || "Yok"} - ${confidence_interval_max || "Yok"}`,
                    };
                } else {
                    results[key][guidelineName] = {
                        status: "Bu değer, bu kılavuzda bulunamadı",
                        range: "Yok",
                        geometricMin: "Yok",
                        geometricMax: "Yok",
                        minMean: "Yok",
                        maxMean: "Yok",
                        confidenceInterval: "Yok",
                    };
                }
            } else {
                results[key][guidelineName] = {
                    status: "Bu değer, bu kılavuzda bulunamadı",
                    range: "Yok",
                    geometricMin: "Yok",
                    geometricMax: "Yok",
                    minMean: "Yok",
                    maxMean: "Yok",
                    confidenceInterval: "Yok",
                };
            }
        });
    }

    return results;
};

