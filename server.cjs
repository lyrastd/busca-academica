var __create = Object.create;
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __getProtoOf = Object.getPrototypeOf;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __copyProps = (to, from, except, desc) => {
  if (from && typeof from === "object" || typeof from === "function") {
    for (let key of __getOwnPropNames(from))
      if (!__hasOwnProp.call(to, key) && key !== except)
        __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
  }
  return to;
};
var __toESM = (mod, isNodeMode, target) => (target = mod != null ? __create(__getProtoOf(mod)) : {}, __copyProps(
  // If the importer is in node compatibility mode or this is not an ESM
  // file that has been converted to a CommonJS file using a Babel-
  // compatible transform (i.e. "__esModule" has not been set), then set
  // "default" to the CommonJS "module.exports" for node compatibility.
  isNodeMode || !mod || !mod.__esModule ? __defProp(target, "default", { value: mod, enumerable: true }) : target,
  mod
));

// server.ts
var import_config = require("dotenv/config");
var import_express = __toESM(require("express"), 1);
var import_path = __toESM(require("path"), 1);
var import_vite = require("vite");

// src/lib/bm25.ts
var STOPWORDS = /* @__PURE__ */ new Set([
  // Português (PT)
  "a",
  "ao",
  "aos",
  "aquela",
  "aquelas",
  "aquele",
  "aqueles",
  "aquilo",
  "as",
  "ate",
  "com",
  "como",
  "da",
  "das",
  "de",
  "dela",
  "delas",
  "dele",
  "deles",
  "do",
  "dos",
  "e",
  "ela",
  "elas",
  "ele",
  "eles",
  "em",
  "entre",
  "era",
  "eram",
  "essa",
  "essas",
  "esse",
  "esses",
  "esta",
  "estas",
  "este",
  "estes",
  "eu",
  "foi",
  "fomos",
  "foram",
  "ha",
  "isso",
  "isto",
  "ja",
  "lhe",
  "lhes",
  "mais",
  "mas",
  "me",
  "mesmo",
  "meu",
  "meus",
  "minha",
  "minhas",
  "muito",
  "na",
  "nao",
  "nas",
  "nem",
  "no",
  "nos",
  "nossa",
  "nossas",
  "nosso",
  "nossos",
  "num",
  "numa",
  "o",
  "os",
  "ou",
  "para",
  "pela",
  "pelas",
  "pelo",
  "pelos",
  "por",
  "qual",
  "quando",
  "que",
  "quem",
  "sao",
  "se",
  "seja",
  "sejam",
  "sem",
  "sera",
  "serao",
  "seu",
  "seus",
  "so",
  "somos",
  "sua",
  "suas",
  "tambem",
  "te",
  "tem",
  "temos",
  "tenha",
  "tenham",
  "teu",
  "teus",
  "tu",
  "tua",
  "tuas",
  "um",
  "uma",
  "voce",
  "voces",
  // Espanhol (ES)
  "el",
  "la",
  "los",
  "las",
  "un",
  "una",
  "unos",
  "unas",
  "y",
  "e",
  "ni",
  "que",
  "pero",
  "mas",
  "aunque",
  "sino",
  "porque",
  "pues",
  "ya",
  "si",
  "con",
  "sin",
  "sobre",
  "tras",
  "para",
  "por",
  "segun",
  "entre",
  "hacia",
  "desde",
  "hasta",
  "durante",
  "mediante",
  "del",
  "al",
  "yo",
  "tu",
  "usted",
  "nosotros",
  "ellos",
  "ellas",
  "su",
  "sus",
  "mi",
  "mis",
  "nuestro",
  "nuestra",
  "este",
  "esta",
  "estos",
  "estas",
  "ese",
  "esa",
  // Inglês (EN)
  "the",
  "a",
  "an",
  "and",
  "or",
  "but",
  "in",
  "on",
  "at",
  "to",
  "for",
  "of",
  "with",
  "by",
  "from",
  "up",
  "about",
  "into",
  "over",
  "after",
  "beneath",
  "under",
  "above",
  "is",
  "are",
  "was",
  "were",
  "be",
  "been",
  "being",
  "have",
  "has",
  "had",
  "do",
  "does",
  "did",
  "we",
  "they",
  "it",
  "this",
  "that",
  "these",
  "those"
]);
function removeDiacritics(str) {
  return str.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase();
}
function stemToken(token) {
  let word = removeDiacritics(token).toLowerCase();
  if (word.length <= 3) return word;
  if (word.endsWith("oes") || word.endsWith("ones") || word.endsWith("tions") || word.endsWith("ciones")) {
    return word.replace(/(oes|ones|tions|ciones)$/, "t");
  }
  if (word.endsWith("mente") || word.endsWith("ment")) {
    return word.replace(/(mente|ment)$/, "");
  }
  if (word.endsWith("idades") || word.endsWith("idades") || word.endsWith("ities")) {
    return word.replace(/(idades|idades|ities)$/, "id");
  }
  if (word.endsWith("dade") || word.endsWith("dad") || word.endsWith("ity")) {
    return word.replace(/(dade|dad|ity)$/, "id");
  }
  if (word.endsWith("avel") || word.endsWith("able") || word.endsWith("ible")) {
    return word.replace(/(avel|able|ible)$/, "abl");
  }
  if (word.endsWith("ing")) {
    return word.replace(/ing$/, "");
  }
  if (word.endsWith("izacao") || word.endsWith("izacion") || word.endsWith("ization")) {
    return word.replace(/(izacao|izacion|ization)$/, "iz");
  }
  if (word.endsWith("logia") || word.endsWith("logy") || word.endsWith("logica")) {
    return word.replace(/(logia|logy|logica)$/, "log");
  }
  if (word.endsWith("es") && word.length > 4) {
    word = word.slice(0, -2);
  } else if (word.endsWith("s") && !word.endsWith("ss") && word.length > 3) {
    word = word.slice(0, -1);
  }
  return word;
}
function tokenize(text) {
  if (!text) return { original: [], stems: [] };
  const rawTokens = removeDiacritics(text).replace(/[^a-z0-9\s-]/g, " ").split(/[\s-]+/).filter((t) => t.length > 1);
  const filteredOriginal = rawTokens.filter((t) => !STOPWORDS.has(t));
  const stems = filteredOriginal.map((t) => stemToken(t));
  return { original: filteredOriginal, stems };
}
var K1 = 1.5;
var B = 0.75;
function calculateBM25Score(query, doc, avgDocLength, totalDocs, termDocFrequencies, useSemantic = false) {
  const queryTokens = tokenize(query);
  const qStems = queryTokens.stems;
  const qOriginals = queryTokens.original;
  if (qStems.length === 0) {
    return {
      bm25: 10,
      morphologicalMatch: 0,
      semanticCosine: 0,
      finalRelevance: 50,
      matchedTerms: []
    };
  }
  const titleTokens = tokenize(doc.title);
  const abstractTokens = tokenize(doc.abstract);
  const kwTokens = tokenize(doc.keywords.concat(doc.fieldsOfStudy).join(" "));
  const authorTokens = tokenize(doc.authors.join(" "));
  const totalLength = titleTokens.stems.length * 3.5 + abstractTokens.stems.length * 1.5 + kwTokens.stems.length * 2.2 + authorTokens.stems.length * 2;
  const matchedTermsSet = /* @__PURE__ */ new Set();
  const getFrequencies = (stems) => {
    const map = /* @__PURE__ */ new Map();
    for (const s of stems) {
      map.set(s, (map.get(s) || 0) + 1);
    }
    return map;
  };
  const tfTitle = getFrequencies(titleTokens.stems);
  const tfAbstract = getFrequencies(abstractTokens.stems);
  const tfKw = getFrequencies(kwTokens.stems);
  const tfAuthor = getFrequencies(authorTokens.stems);
  let bm25Score = 0;
  let exactMatchCount = 0;
  let morphologicalMatchCount = 0;
  for (let i = 0; i < qStems.length; i++) {
    const stem = qStems[i];
    const orig = qOriginals[i] || stem;
    const df = termDocFrequencies.get(stem) || 1;
    const idf = Math.log((totalDocs - df + 0.5) / (df + 0.5) + 1);
    const freqInTitle = tfTitle.get(stem) || 0;
    const freqInAbstract = tfAbstract.get(stem) || 0;
    const freqInKw = tfKw.get(stem) || 0;
    const freqInAuthor = tfAuthor.get(stem) || 0;
    const weightedTf = freqInTitle * 3.5 + freqInAbstract * 1.5 + freqInKw * 2.2 + freqInAuthor * 2;
    if (weightedTf > 0) {
      matchedTermsSet.add(orig);
      morphologicalMatchCount++;
      const docLenNorm = 1 - B + B * (totalLength / (avgDocLength || 100));
      const termScore = idf * (weightedTf * (K1 + 1) / (weightedTf + K1 * docLenNorm));
      bm25Score += termScore;
    }
    const normTitle = removeDiacritics(doc.title);
    if (normTitle.includes(orig)) {
      exactMatchCount++;
      bm25Score += 2;
    }
  }
  const normQuery = removeDiacritics(query.trim());
  const normDocTitle = removeDiacritics(doc.title);
  if (normDocTitle.includes(normQuery)) {
    bm25Score *= 1.45;
  } else if (removeDiacritics(doc.abstract).includes(normQuery)) {
    bm25Score *= 1.2;
  }
  const citations = doc.citationCount || 0;
  const citationFactor = Math.min(1.25, 1 + Math.log10(citations + 1) * 0.05);
  bm25Score *= citationFactor;
  const semanticCosine = computeSemanticCosine(query, `${doc.title} ${doc.keywords.join(" ")} ${doc.abstract.slice(0, 300)}`);
  let rawScore = bm25Score;
  if (useSemantic) {
    rawScore = bm25Score * 0.65 + semanticCosine * 50 * 0.35;
  }
  const finalRelevance = Math.min(99, Math.max(15, Math.round(Math.atan(rawScore / 10) / (Math.PI / 2) * 100)));
  return {
    bm25: Number(bm25Score.toFixed(2)),
    morphologicalMatch: morphologicalMatchCount,
    semanticCosine: Number(semanticCosine.toFixed(3)),
    finalRelevance,
    matchedTerms: Array.from(matchedTermsSet)
  };
}
function computeSemanticCosine(textA, textB) {
  const getTrigrams = (str) => {
    const cleaned = `_${removeDiacritics(str).replace(/[^a-z0-9]/g, "_")}_`;
    const map = /* @__PURE__ */ new Map();
    for (let i = 0; i < cleaned.length - 2; i++) {
      const tri = cleaned.slice(i, i + 3);
      map.set(tri, (map.get(tri) || 0) + 1);
    }
    return map;
  };
  const mapA = getTrigrams(textA);
  const mapB = getTrigrams(textB);
  let dotProduct = 0;
  let normA = 0;
  let normB = 0;
  for (const [, count] of mapA) {
    normA += count * count;
  }
  for (const [, count] of mapB) {
    normB += count * count;
  }
  for (const [tri, countA] of mapA) {
    const countB = mapB.get(tri);
    if (countB) {
      dotProduct += countA * countB;
    }
  }
  if (normA === 0 || normB === 0) return 0;
  return dotProduct / (Math.sqrt(normA) * Math.sqrt(normB));
}

// src/lib/dedup.ts
function normalizeDoi(doi) {
  if (!doi) return null;
  const clean = doi.trim().toLowerCase().replace(/^https?:\/\/(dx\.)?doi\.org\//i, "").replace(/^doi:\s*/i, "").replace(/[>\]\)\.,;]+$/, "");
  return clean.startsWith("10.") ? clean : null;
}
function normalizeTitle(title) {
  if (!title) return "";
  return removeDiacritics(title).replace(/<[^>]*>/g, "").replace(/[^a-z0-9\s]/g, " ").replace(/\s+/g, " ").trim();
}
function stringSimilarity(strA, strB) {
  if (strA === strB) return 1;
  if (!strA || !strB) return 0;
  if (strA.length < 2 || strB.length < 2) return 0;
  const getBigrams = (str) => {
    const s = str.replace(/\s+/g, "");
    const set = /* @__PURE__ */ new Map();
    for (let i = 0; i < s.length - 1; i++) {
      const bi = s.slice(i, i + 2);
      set.set(bi, (set.get(bi) || 0) + 1);
    }
    return set;
  };
  const mapA = getBigrams(strA);
  const mapB = getBigrams(strB);
  let intersection = 0;
  let totalA = 0;
  let totalB = 0;
  for (const [, count] of mapA) totalA += count;
  for (const [, count] of mapB) totalB += count;
  for (const [bi, countA] of mapA) {
    const countB = mapB.get(bi);
    if (countB) {
      intersection += Math.min(countA, countB);
    }
  }
  return 2 * intersection / (totalA + totalB);
}
function deduplicateArticles(articles) {
  const unifiedList = [];
  const doiMap = /* @__PURE__ */ new Map();
  for (const current of articles) {
    const currentDoi = normalizeDoi(current.doi);
    const normTitle = normalizeTitle(current.title);
    let matchIndex = -1;
    if (currentDoi && doiMap.has(currentDoi)) {
      matchIndex = doiMap.get(currentDoi);
    } else {
      for (let i = 0; i < unifiedList.length; i++) {
        const existing = unifiedList[i];
        const existingNormTitle = normalizeTitle(existing.title);
        const lenRatio = Math.min(normTitle.length, existingNormTitle.length) / Math.max(normTitle.length, existingNormTitle.length);
        if (lenRatio < 0.7) continue;
        const sim = stringSimilarity(normTitle, existingNormTitle);
        if (sim >= 0.88) {
          const yearDiff = current.year && existing.year ? Math.abs(current.year - existing.year) : 0;
          if (yearDiff <= 1) {
            matchIndex = i;
            break;
          }
        }
      }
    }
    if (matchIndex >= 0) {
      const existing = unifiedList[matchIndex];
      unifiedList[matchIndex] = mergeTwoArticles(existing, current);
      if (currentDoi && !doiMap.has(currentDoi)) {
        doiMap.set(currentDoi, matchIndex);
      }
    } else {
      const newIndex = unifiedList.length;
      unifiedList.push(current);
      if (currentDoi) {
        doiMap.set(currentDoi, newIndex);
      }
    }
  }
  return unifiedList;
}
function mergeTwoArticles(target, source) {
  const mergedSources = Array.from(/* @__PURE__ */ new Set([...target.sources, ...source.sources]));
  const abstract = source.abstract && source.abstract.length > (target.abstract?.length || 0) ? source.abstract : target.abstract || source.abstract || "";
  const title = source.title && target.title === target.title.toUpperCase() && source.title !== source.title.toUpperCase() ? source.title : target.title || source.title;
  const isOpen = target.openAccess.isOpen || source.openAccess.isOpen;
  const pdfUrl = target.openAccess.pdfUrl || source.openAccess.pdfUrl;
  const oaStatus = target.openAccess.status !== "closed" && target.openAccess.status !== "unknown" ? target.openAccess.status : source.openAccess.status;
  const citationCount = Math.max(target.citationCount || 0, source.citationCount || 0);
  const fieldsOfStudy = Array.from(/* @__PURE__ */ new Set([...target.fieldsOfStudy, ...source.fieldsOfStudy]));
  const keywords = Array.from(/* @__PURE__ */ new Set([...target.keywords, ...source.keywords]));
  const hasAffiliationTarget = target.authors.some((a) => a.affiliation);
  const hasAffiliationSource = source.authors.some((a) => a.affiliation);
  const authors = hasAffiliationSource && !hasAffiliationTarget && source.authors.length > 0 ? source.authors : target.authors.length > 0 ? target.authors : source.authors;
  const urls = {
    doiUrl: target.urls.doiUrl || source.urls.doiUrl,
    pdfUrl: target.urls.pdfUrl || source.urls.pdfUrl || pdfUrl || void 0,
    landingPage: target.urls.landingPage || source.urls.landingPage
  };
  const sourceDetails = {
    ...target.sourceDetails,
    ...source.sourceDetails
  };
  return {
    ...target,
    title,
    doi: target.doi || source.doi,
    abstract,
    venue: target.venue || source.venue,
    year: target.year || source.year,
    publicationDate: target.publicationDate || source.publicationDate,
    publisher: target.publisher || source.publisher,
    publicationType: target.publicationType !== "other" ? target.publicationType : source.publicationType,
    authors,
    citationCount,
    fieldsOfStudy,
    keywords,
    sources: mergedSources,
    sourceDetails,
    openAccess: {
      isOpen,
      status: oaStatus || "unknown",
      pdfUrl: pdfUrl || null,
      license: target.openAccess.license || source.openAccess.license
    },
    urls,
    score: {
      bm25: Math.max(target.score.bm25, source.score.bm25),
      morphologicalMatch: Math.max(target.score.morphologicalMatch, source.score.morphologicalMatch),
      semanticCosine: Math.max(target.score.semanticCosine || 0, source.score.semanticCosine || 0),
      finalRelevance: Math.max(target.score.finalRelevance, source.score.finalRelevance),
      matchedTerms: Array.from(/* @__PURE__ */ new Set([...target.score.matchedTerms, ...source.score.matchedTerms]))
    }
  };
}

// src/lib/harvester.ts
var TIMEOUT_MS = 6e3;
async function fetchWithTimeout(url, options = {}, timeoutMs = TIMEOUT_MS) {
  const controller = new AbortController();
  const id = setTimeout(() => controller.abort(), timeoutMs);
  try {
    const response = await fetch(url, {
      ...options,
      signal: controller.signal
    });
    clearTimeout(id);
    return response;
  } catch (err) {
    clearTimeout(id);
    throw err;
  }
}
function handleSourceResponseError(source, res, startTime) {
  const elapsed = Date.now() - startTime;
  if (res.status === 429) {
    return {
      source,
      articles: [],
      status: "rate-limited",
      responseTimeMs: elapsed,
      errorMessage: `Bloqueio tempor\xE1rio por taxa de requisi\xE7\xF5es (${source} HTTP 429)`,
      errorDetail: `A API externa ${source} aplicou restri\xE7\xE3o de cota (Rate Limit HTTP 429). Limite de requisi\xE7\xF5es por minuto excedido.`
    };
  }
  if (res.status === 403) {
    return {
      source,
      articles: [],
      status: "error",
      responseTimeMs: elapsed,
      errorMessage: `Acesso negado ou restri\xE7\xE3o de IP (${source} HTTP 403)`,
      errorDetail: `A API externa ${source} recusou a conex\xE3o (HTTP 403 Forbidden). Verifique autoriza\xE7\xF5es e regras de firewall.`
    };
  }
  if (res.status >= 500) {
    return {
      source,
      articles: [],
      status: "error",
      responseTimeMs: elapsed,
      errorMessage: `Servidor da base indispon\xEDvel (${source} HTTP ${res.status})`,
      errorDetail: `O servidor remoto da base ${source} retornou status ${res.status}. O servi\xE7o externo pode estar em manuten\xE7\xE3o tempor\xE1ria.`
    };
  }
  return {
    source,
    articles: [],
    status: "error",
    responseTimeMs: elapsed,
    errorMessage: `Erro HTTP ${res.status} na API ${source}`,
    errorDetail: `A API externa ${source} retornou resposta inesperada com c\xF3digo HTTP ${res.status}.`
  };
}
function handleSourceCatchError(source, err, startTime) {
  const elapsed = Date.now() - startTime;
  const isTimeout = err?.name === "AbortError" || err?.message?.includes("aborted") || err?.message?.includes("timeout");
  if (isTimeout) {
    return {
      source,
      articles: [],
      status: "timeout",
      responseTimeMs: elapsed,
      errorMessage: `Tempo limite de resposta esgotado (${source} > 6s)`,
      errorDetail: `O reposit\xF3rio ${source} n\xE3o respondeu dentro da janela de 6 segundos. A conex\xE3o internacional pode estar sobrecarregada.`
    };
  }
  return {
    source,
    articles: [],
    status: "error",
    responseTimeMs: elapsed,
    errorMessage: `Falha de rede ou conex\xE3o (${source})`,
    errorDetail: `N\xE3o foi poss\xEDvel estabelecer conex\xE3o TCP/HTTPS com o endpoint da base ${source}: ${err?.message || "Falha de comunica\xE7\xE3o"}.`
  };
}
async function harvestOpenAlex(query) {
  const startTime = Date.now();
  const source = "OpenAlex";
  try {
    const url = `https://api.openalex.org/works?search=${encodeURIComponent(query)}&per_page=25&mailto=academic-search@unila.edu.br`;
    const res = await fetchWithTimeout(url);
    if (!res.ok) return handleSourceResponseError(source, res, startTime);
    const data = await res.json();
    const articles = (data.results || []).map((item) => {
      const doi = normalizeDoi(item.doi);
      const authors = (item.authorships || []).map((a) => ({
        name: a.author?.display_name || "Desconhecido",
        affiliation: a.institutions?.[0]?.display_name,
        orcid: a.author?.orcid
      }));
      let abstract = "";
      if (item.abstract_inverted_index) {
        const words = [];
        for (const [word, positions] of Object.entries(item.abstract_inverted_index)) {
          for (const pos of positions) {
            words.push([pos, word]);
          }
        }
        words.sort((a, b) => a[0] - b[0]);
        abstract = words.map((w) => w[1]).join(" ");
      }
      const concepts = (item.concepts || []).map((c) => c.display_name);
      const fields = (item.topics || []).map((t) => t.display_name).concat(concepts.slice(0, 3));
      let pubType = "journal-article";
      if (item.type === "book-chapter" || item.type === "book") pubType = "book-chapter";
      else if (item.type === "proceedings-article" || item.type === "conference-paper") pubType = "proceedings-article";
      else if (item.type === "preprint") pubType = "preprint";
      else if (item.type === "dissertation" || item.type === "thesis") pubType = "thesis";
      const oaStatus = item.open_access?.is_oa ? item.open_access?.oa_status || "gold" : "closed";
      return {
        id: `oa-${item.id || Math.random().toString(36).substring(2, 9)}`,
        doi,
        title: item.title || "Sem t\xEDtulo",
        authors,
        year: item.publication_year || null,
        publicationDate: item.publication_date,
        abstract: abstract || "",
        venue: item.primary_location?.source?.display_name || item.host_venue?.name,
        volume: item.biblio?.volume,
        issue: item.biblio?.issue,
        pages: item.biblio?.first_page ? `${item.biblio.first_page}-${item.biblio.last_page || ""}` : void 0,
        publisher: item.primary_location?.source?.publisher,
        publicationType: pubType,
        openAccess: {
          isOpen: !!item.open_access?.is_oa,
          status: oaStatus,
          pdfUrl: item.open_access?.oa_url || item.best_oa_location?.pdf_url || null,
          license: item.open_access?.license
        },
        citationCount: item.cited_by_count || 0,
        fieldsOfStudy: fields.slice(0, 5),
        keywords: concepts.slice(0, 6),
        language: item.language || "en",
        sources: [source],
        sourceDetails: {
          OpenAlex: {
            externalId: item.id,
            url: item.id
          }
        },
        urls: {
          doiUrl: doi ? `https://doi.org/${doi}` : void 0,
          pdfUrl: item.open_access?.oa_url || item.best_oa_location?.pdf_url,
          landingPage: item.primary_location?.landing_page_url || item.id
        },
        score: {
          bm25: 0,
          morphologicalMatch: 0,
          finalRelevance: 0,
          matchedTerms: []
        }
      };
    });
    return {
      source,
      articles,
      status: "ok",
      responseTimeMs: Date.now() - startTime
    };
  } catch (err) {
    return handleSourceCatchError(source, err, startTime);
  }
}
async function harvestCrossref(query) {
  const startTime = Date.now();
  const source = "Crossref";
  try {
    const url = `https://api.crossref.org/works?query=${encodeURIComponent(query)}&rows=25&mailto=academic-search@unila.edu.br`;
    const res = await fetchWithTimeout(url);
    if (!res.ok) return handleSourceResponseError(source, res, startTime);
    const data = await res.json();
    const articles = (data.message?.items || []).map((item) => {
      const doi = normalizeDoi(item.DOI);
      const authors = (item.author || []).map((a) => ({
        name: [a.given, a.family].filter(Boolean).join(" ") || a.name || "Desconhecido",
        affiliation: a.affiliation?.[0]?.name,
        orcid: a.ORCID
      }));
      const year = item.published?.["date-parts"]?.[0]?.[0] || item["published-print"]?.["date-parts"]?.[0]?.[0] || item["published-online"]?.["date-parts"]?.[0]?.[0] || null;
      let abstract = (item.abstract || "").replace(/<jats:[^>]+>/g, "").replace(/<\/jats:[^>]+>/g, "").replace(/<[^>]+>/g, "");
      let pubType = "journal-article";
      if (item.type === "book-chapter" || item.type === "monograph") pubType = "book-chapter";
      else if (item.type === "proceedings-article") pubType = "proceedings-article";
      else if (item.type === "posted-content") pubType = "preprint";
      else if (item.type === "dissertation") pubType = "thesis";
      const isOpen = item.license ? true : false;
      const pdfLink = item.link?.find((l) => l["content-type"] === "application/pdf")?.URL;
      return {
        id: `cr-${item.DOI ? item.DOI.replace(/[^a-zA-Z0-9]/g, "") : Math.random().toString(36).substring(2, 9)}`,
        doi,
        title: item.title?.[0] || "Sem t\xEDtulo",
        authors,
        year,
        abstract,
        venue: item["container-title"]?.[0],
        volume: item.volume,
        issue: item.issue,
        pages: item.page,
        publisher: item.publisher,
        publicationType: pubType,
        openAccess: {
          isOpen,
          status: isOpen ? "gold" : "closed",
          pdfUrl: pdfLink || null,
          license: item.license?.[0]?.URL
        },
        citationCount: item["is-referenced-by-count"] || 0,
        fieldsOfStudy: (item.subject || []).slice(0, 4),
        keywords: (item.subject || []).slice(0, 6),
        language: item.language || "pt",
        sources: [source],
        sourceDetails: {
          Crossref: {
            externalId: item.DOI,
            url: doi ? `https://doi.org/${doi}` : void 0
          }
        },
        urls: {
          doiUrl: doi ? `https://doi.org/${doi}` : void 0,
          pdfUrl: pdfLink,
          landingPage: item.URL || (doi ? `https://doi.org/${doi}` : void 0)
        },
        score: {
          bm25: 0,
          morphologicalMatch: 0,
          finalRelevance: 0,
          matchedTerms: []
        }
      };
    });
    return {
      source,
      articles,
      status: "ok",
      responseTimeMs: Date.now() - startTime
    };
  } catch (err) {
    return handleSourceCatchError(source, err, startTime);
  }
}
async function harvestSemanticScholar(query) {
  const startTime = Date.now();
  const source = "Semantic Scholar";
  try {
    const url = `https://api.semanticscholar.org/graph/v1/paper/search?query=${encodeURIComponent(query)}&limit=25&fields=title,authors,year,abstract,citationCount,isOpenAccess,openAccessPdf,fieldsOfStudy,publicationTypes,venue,externalIds`;
    const res = await fetchWithTimeout(url, {
      headers: {
        "User-Agent": "UNILA-AcademicSearch/1.0 (academic research project)"
      }
    });
    if (!res.ok) return handleSourceResponseError(source, res, startTime);
    const data = await res.json();
    const articles = (data.data || []).map((item) => {
      const doi = normalizeDoi(item.externalIds?.DOI);
      const authors = (item.authors || []).map((a) => ({
        name: a.name || "Desconhecido"
      }));
      let pubType = "journal-article";
      if (item.publicationTypes?.includes("Review")) pubType = "review";
      else if (item.publicationTypes?.includes("Conference")) pubType = "proceedings-article";
      else if (item.publicationTypes?.includes("Book")) pubType = "book-chapter";
      const isOpen = !!item.isOpenAccess;
      return {
        id: `s2-${item.paperId}`,
        doi,
        title: item.title || "Sem t\xEDtulo",
        authors,
        year: item.year || null,
        abstract: item.abstract || "",
        venue: item.venue || void 0,
        publisher: void 0,
        publicationType: pubType,
        openAccess: {
          isOpen,
          status: isOpen ? "gold" : "closed",
          pdfUrl: item.openAccessPdf?.url || null
        },
        citationCount: item.citationCount || 0,
        fieldsOfStudy: item.fieldsOfStudy || [],
        keywords: (item.fieldsOfStudy || []).slice(0, 4),
        language: "en",
        sources: [source],
        sourceDetails: {
          "Semantic Scholar": {
            externalId: item.paperId,
            url: `https://www.semanticscholar.org/paper/${item.paperId}`
          }
        },
        urls: {
          doiUrl: doi ? `https://doi.org/${doi}` : void 0,
          pdfUrl: item.openAccessPdf?.url,
          landingPage: `https://www.semanticscholar.org/paper/${item.paperId}`
        },
        score: {
          bm25: 0,
          morphologicalMatch: 0,
          finalRelevance: 0,
          matchedTerms: []
        }
      };
    });
    return {
      source,
      articles,
      status: "ok",
      responseTimeMs: Date.now() - startTime
    };
  } catch (err) {
    return handleSourceCatchError(source, err, startTime);
  }
}
async function harvestEuropePMC(query) {
  const startTime = Date.now();
  const source = "Europe PMC";
  try {
    const url = `https://www.ebi.ac.uk/europepmc/webservices/rest/search?query=${encodeURIComponent(query)}&format=json&pageSize=25&resultType=core`;
    const res = await fetchWithTimeout(url);
    if (!res.ok) return handleSourceResponseError(source, res, startTime);
    const data = await res.json();
    const articles = (data.resultList?.result || []).map((item) => {
      const doi = normalizeDoi(item.doi);
      const authors = (item.authorList?.author || []).map((a) => ({
        name: [a.firstName, a.lastName].filter(Boolean).join(" ") || a.fullName || "Desconhecido",
        affiliation: a.authorAffiliationDetailsList?.authorAffiliation?.[0]?.affiliation
      }));
      const isOpen = item.isOpenAccess === "Y";
      const pmid = item.pmid;
      const pmcid = item.pmcid;
      let pdfUrl = null;
      if (pmcid) {
        pdfUrl = `https://europepmc.org/articles/${pmcid}?pdf=render`;
      }
      return {
        id: `epmc-${item.id || Math.random().toString(36).substring(2, 9)}`,
        doi,
        title: item.title?.replace(/\.$/, "") || "Sem t\xEDtulo",
        authors,
        year: item.pubYear ? parseInt(item.pubYear, 10) : null,
        abstract: item.abstractText || "",
        venue: item.journalTitle || item.journalInfo?.journal?.title,
        volume: item.journalInfo?.volume,
        issue: item.journalInfo?.issue,
        pages: item.pageInfo,
        publicationType: item.pubType === "review" ? "review" : "journal-article",
        openAccess: {
          isOpen,
          status: isOpen ? "gold" : "closed",
          pdfUrl
        },
        citationCount: item.citedByCount || 0,
        fieldsOfStudy: ["Biomedicina", "Sa\xFAde P\xFAblica", "Biotecnologia"],
        keywords: (item.keywordList?.keyword || []).slice(0, 5),
        language: item.language || "en",
        sources: [source],
        sourceDetails: {
          "Europe PMC": {
            externalId: item.id,
            url: `https://europepmc.org/article/${item.source || "MED"}/${item.id}`
          }
        },
        urls: {
          doiUrl: doi ? `https://doi.org/${doi}` : void 0,
          pdfUrl: pdfUrl || void 0,
          landingPage: `https://europepmc.org/article/${item.source || "MED"}/${item.id}`
        },
        score: {
          bm25: 0,
          morphologicalMatch: 0,
          finalRelevance: 0,
          matchedTerms: []
        }
      };
    });
    return {
      source,
      articles,
      status: "ok",
      responseTimeMs: Date.now() - startTime
    };
  } catch (err) {
    return handleSourceCatchError(source, err, startTime);
  }
}
async function harvestArXiv(query) {
  const startTime = Date.now();
  const source = "arXiv";
  try {
    const url = `https://export.arxiv.org/api/query?search_query=all:${encodeURIComponent(query)}&start=0&max_results=25`;
    const res = await fetchWithTimeout(url);
    if (!res.ok) return handleSourceResponseError(source, res, startTime);
    const xml = await res.text();
    const articles = [];
    const entryRegex = /<entry>([\s\S]*?)<\/entry>/g;
    let match;
    while ((match = entryRegex.exec(xml)) !== null) {
      const entryXml = match[1];
      const idMatch = /<id>([^<]+)<\/id>/.exec(entryXml);
      const titleMatch = /<title>([\s\S]*?)<\/title>/.exec(entryXml);
      const summaryMatch = /<summary>([\s\S]*?)<\/summary>/.exec(entryXml);
      const publishedMatch = /<published>([^<]+)<\/published>/.exec(entryXml);
      const doiMatch = /<arxiv:doi>([^<]+)<\/arxiv:doi>/.exec(entryXml);
      const pdfMatch = /<link[^>]*title="pdf"[^>]*href="([^"]+)"/.exec(entryXml);
      const authors = [];
      const authorRegex = /<author>\s*<name>([^<]+)<\/name>/g;
      let aMatch;
      while ((aMatch = authorRegex.exec(entryXml)) !== null) {
        authors.push({ name: aMatch[1].trim() });
      }
      const categories = [];
      const catRegex = /<category[^>]*term="([^"]+)"/g;
      let cMatch;
      while ((cMatch = catRegex.exec(entryXml)) !== null) {
        categories.push(cMatch[1]);
      }
      const rawId = idMatch ? idMatch[1].trim() : "";
      const arxivId = rawId.replace("http://arxiv.org/abs/", "").replace("https://arxiv.org/abs/", "");
      const pubYear = publishedMatch ? parseInt(publishedMatch[1].slice(0, 4), 10) : null;
      const cleanTitle = titleMatch ? titleMatch[1].replace(/\s+/g, " ").trim() : "Sem t\xEDtulo";
      const cleanSummary = summaryMatch ? summaryMatch[1].replace(/\s+/g, " ").trim() : "";
      const doi = doiMatch ? normalizeDoi(doiMatch[1]) : null;
      const pdfUrl = pdfMatch ? pdfMatch[1] : arxivId ? `https://arxiv.org/pdf/${arxivId}.pdf` : null;
      articles.push({
        id: `arxiv-${arxivId || Math.random().toString(36).substring(2, 8)}`,
        doi,
        title: cleanTitle,
        authors,
        year: pubYear,
        publicationDate: publishedMatch ? publishedMatch[1].slice(0, 10) : void 0,
        abstract: cleanSummary,
        venue: "arXiv e-Print Archive",
        publicationType: "preprint",
        openAccess: {
          isOpen: true,
          status: "green",
          pdfUrl,
          license: "arXiv Non-exclusive distribution license"
        },
        citationCount: 0,
        fieldsOfStudy: categories.length > 0 ? categories.slice(0, 4) : ["F\xEDsica", "Ci\xEAncia da Computa\xE7\xE3o", "Matem\xE1tica"],
        keywords: categories.slice(0, 5),
        language: "en",
        sources: [source],
        sourceDetails: {
          arXiv: {
            externalId: arxivId,
            url: `https://arxiv.org/abs/${arxivId}`
          }
        },
        urls: {
          doiUrl: doi ? `https://doi.org/${doi}` : void 0,
          pdfUrl: pdfUrl || void 0,
          landingPage: `https://arxiv.org/abs/${arxivId}`
        },
        score: {
          bm25: 0,
          morphologicalMatch: 0,
          finalRelevance: 0,
          matchedTerms: []
        }
      });
    }
    return {
      source,
      articles,
      status: "ok",
      responseTimeMs: Date.now() - startTime
    };
  } catch (err) {
    return handleSourceCatchError(source, err, startTime);
  }
}
async function harvestDOAJ(query) {
  const startTime = Date.now();
  const source = "DOAJ";
  try {
    const url = `https://doaj.org/api/v2/search/articles/${encodeURIComponent(query)}?pageSize=25`;
    const res = await fetchWithTimeout(url);
    if (!res.ok) return handleSourceResponseError(source, res, startTime);
    const data = await res.json();
    const articles = (data.results || []).map((item) => {
      const bibjson = item.bibjson || {};
      const doiObj = (bibjson.identifier || []).find((i) => i.type === "doi");
      const doi = normalizeDoi(doiObj?.id);
      const authors = (bibjson.author || []).map((a) => ({
        name: a.name || "Desconhecido",
        affiliation: a.affiliation,
        orcid: a.orcid_id
      }));
      const fulltextLink = (bibjson.link || []).find((l) => l.type === "fulltext")?.url;
      return {
        id: `doaj-${item.id || Math.random().toString(36).substring(2, 9)}`,
        doi,
        title: bibjson.title || "Sem t\xEDtulo",
        authors,
        year: bibjson.year ? parseInt(bibjson.year, 10) : null,
        abstract: bibjson.abstract || "",
        venue: bibjson.journal?.title,
        volume: bibjson.journal?.volume,
        issue: bibjson.journal?.number,
        publisher: bibjson.journal?.publisher,
        publicationType: "journal-article",
        openAccess: {
          isOpen: true,
          status: "gold",
          pdfUrl: fulltextLink || null,
          license: bibjson.journal?.license?.[0]?.type
        },
        citationCount: 0,
        fieldsOfStudy: (bibjson.subject || []).map((s) => s.term).slice(0, 4),
        keywords: (bibjson.keywords || []).slice(0, 5),
        language: bibjson.journal?.language?.[0] || "pt",
        sources: [source],
        sourceDetails: {
          DOAJ: {
            externalId: item.id,
            url: `https://doaj.org/article/${item.id}`
          }
        },
        urls: {
          doiUrl: doi ? `https://doi.org/${doi}` : void 0,
          pdfUrl: fulltextLink,
          landingPage: `https://doaj.org/article/${item.id}`
        },
        score: {
          bm25: 0,
          morphologicalMatch: 0,
          finalRelevance: 0,
          matchedTerms: []
        }
      };
    });
    return {
      source,
      articles,
      status: "ok",
      responseTimeMs: Date.now() - startTime
    };
  } catch (err) {
    return handleSourceCatchError(source, err, startTime);
  }
}
async function harvestCORE(query) {
  const startTime = Date.now();
  const source = "CORE";
  try {
    const url = `https://api.core.ac.uk/v3/search/works?q=${encodeURIComponent(query)}&limit=25`;
    const res = await fetchWithTimeout(url);
    if (!res.ok) return handleSourceResponseError(source, res, startTime);
    const data = await res.json();
    const articles = (data.results || []).map((item) => {
      const doi = normalizeDoi(item.doi);
      const authors = (item.authors || []).map((a) => ({
        name: typeof a === "string" ? a : a.name || "Desconhecido"
      }));
      return {
        id: `core-${item.id || Math.random().toString(36).substring(2, 9)}`,
        doi,
        title: item.title || "Sem t\xEDtulo",
        authors,
        year: item.yearPublished || null,
        abstract: item.abstract || "",
        venue: item.journals?.[0]?.title || item.publisher,
        publicationType: "journal-article",
        openAccess: {
          isOpen: true,
          status: "green",
          pdfUrl: item.downloadUrl || null
        },
        citationCount: item.citationCount || 0,
        fieldsOfStudy: (item.topics || []).slice(0, 4),
        keywords: (item.topics || []).slice(0, 5),
        language: item.language?.code || "en",
        sources: [source],
        sourceDetails: {
          CORE: {
            externalId: String(item.id),
            url: `https://core.ac.uk/works/${item.id}`
          }
        },
        urls: {
          doiUrl: doi ? `https://doi.org/${doi}` : void 0,
          pdfUrl: item.downloadUrl,
          landingPage: `https://core.ac.uk/works/${item.id}`
        },
        score: {
          bm25: 0,
          morphologicalMatch: 0,
          finalRelevance: 0,
          matchedTerms: []
        }
      };
    });
    return {
      source,
      articles,
      status: "ok",
      responseTimeMs: Date.now() - startTime
    };
  } catch (err) {
    return handleSourceCatchError(source, err, startTime);
  }
}
async function harvestCAPES(query) {
  const startTime = Date.now();
  const source = "Portal CAPES";
  try {
    const bdtdUrl = `https://bdtd.ibict.br/vufind/api/v1/search?lookfor=${encodeURIComponent(query)}&type=AllFields&limit=25`;
    const crossrefCapesUrl = `https://api.crossref.org/works?query=${encodeURIComponent(query)}&filter=funder:501100002322&rows=25&mailto=academic-search@unila.edu.br`;
    const [bdtdRes, crossrefRes] = await Promise.allSettled([
      fetchWithTimeout(bdtdUrl, {}, 4500),
      fetchWithTimeout(crossrefCapesUrl, {}, 4500)
    ]);
    const articles = [];
    if (bdtdRes.status === "fulfilled" && bdtdRes.value.ok) {
      try {
        const data = await bdtdRes.value.json();
        const records = data.records || [];
        for (const item of records) {
          const authorsList = [];
          if (item.authors?.primary) {
            for (const authorName of Object.keys(item.authors.primary)) {
              authorsList.push({ name: authorName.replace(/,\s*/g, " ").trim() });
            }
          }
          if (item.authors?.secondary) {
            for (const authorName of Object.keys(item.authors.secondary)) {
              if (authorsList.length < 5) {
                authorsList.push({ name: authorName.replace(/,\s*/g, " ").trim() });
              }
            }
          }
          if (authorsList.length === 0) {
            authorsList.push({ name: "Pesquisador(a) P\xF3s-Gradua\xE7\xE3o CAPES" });
          }
          const fields = [];
          const keywords = [];
          if (Array.isArray(item.subjects)) {
            for (const s of item.subjects) {
              const text = Array.isArray(s) ? s[0] : String(s);
              if (text.includes("CNPQ::") || text.includes("::")) {
                fields.push(text.replace(/CNPQ::/g, "").replace(/::/g, " - "));
              } else {
                keywords.push(text);
              }
            }
          }
          const primaryUrl = item.urls?.[0]?.url;
          const isThesis = item.formats?.includes("doctoralThesis") || item.formats?.includes("masterThesis") || item.formats?.includes("thesis");
          const pubType = isThesis ? "thesis" : "journal-article";
          const portalCapesLink = `https://www.periodicos.capes.gov.br/index.php/acervo/buscador.html?q=${encodeURIComponent(item.title || query)}`;
          articles.push({
            id: `capes-bdtd-${item.id || Math.random().toString(36).substring(2, 9)}`,
            doi: null,
            title: item.title || "Pesquisa Acad\xEAmica Registrada na CAPES",
            authors: authorsList,
            year: item.year ? parseInt(item.year, 10) : (/* @__PURE__ */ new Date()).getFullYear() - 1,
            abstract: item.title ? `${item.title}. Produ\xE7\xE3o cient\xEDfica catalogada no Banco de Teses e Disserta\xE7\xF5es da CAPES/MEC.` : "",
            venue: isThesis ? "Cat\xE1logo de Teses e Disserta\xE7\xF5es CAPES" : "Portal de Peri\xF3dicos CAPES",
            publisher: "Coordena\xE7\xE3o de Aperfei\xE7oamento de Pessoal de N\xEDvel Superior (CAPES)",
            publicationType: pubType,
            openAccess: {
              isOpen: true,
              status: "green",
              pdfUrl: primaryUrl || null
            },
            citationCount: 0,
            fieldsOfStudy: fields.slice(0, 4),
            keywords: keywords.slice(0, 6),
            language: item.languages?.[0] || "pt",
            sources: [source],
            sourceDetails: {
              "Portal CAPES": {
                externalId: item.id,
                url: primaryUrl || portalCapesLink
              }
            },
            urls: {
              doiUrl: void 0,
              pdfUrl: primaryUrl,
              landingPage: primaryUrl || portalCapesLink
            },
            score: {
              bm25: 0,
              morphologicalMatch: 0,
              finalRelevance: 0,
              matchedTerms: []
            }
          });
        }
      } catch (e) {
        console.warn("Error parsing BDTD CAPES payload:", e);
      }
    }
    if (crossrefRes.status === "fulfilled" && crossrefRes.value.ok) {
      try {
        const data = await crossrefRes.value.json();
        const items = data.message?.items || [];
        for (const item of items) {
          const doi = normalizeDoi(item.DOI);
          const authors = (item.author || []).map((a) => ({
            name: [a.given, a.family].filter(Boolean).join(" ") || a.name || "Desconhecido",
            affiliation: a.affiliation?.[0]?.name,
            orcid: a.ORCID
          }));
          const year = item.published?.["date-parts"]?.[0]?.[0] || item["published-print"]?.["date-parts"]?.[0]?.[0] || item["published-online"]?.["date-parts"]?.[0]?.[0] || null;
          let abstract = (item.abstract || "").replace(/<jats:[^>]+>/g, "").replace(/<\/jats:[^>]+>/g, "").replace(/<[^>]+>/g, "");
          const isOpen = item.license ? true : false;
          const pdfLink = item.link?.find((l) => l["content-type"] === "application/pdf")?.URL;
          const portalCapesLink = doi ? `https://www.periodicos.capes.gov.br/index.php/acervo/buscador.html?q=${encodeURIComponent(doi)}` : item.URL || `https://www.periodicos.capes.gov.br/`;
          articles.push({
            id: `capes-cr-${item.DOI ? item.DOI.replace(/[^a-zA-Z0-9]/g, "") : Math.random().toString(36).substring(2, 9)}`,
            doi,
            title: item.title?.[0] || "Artigo Fomento CAPES",
            authors,
            year,
            abstract,
            venue: item["container-title"]?.[0] ? `${item["container-title"]?.[0]} (Fomento CAPES)` : "Peri\xF3dico Indexado CAPES",
            volume: item.volume,
            issue: item.issue,
            pages: item.page,
            publisher: item.publisher,
            publicationType: "journal-article",
            openAccess: {
              isOpen,
              status: isOpen ? "gold" : "closed",
              pdfUrl: pdfLink || null,
              license: item.license?.[0]?.URL
            },
            citationCount: item["is-referenced-by-count"] || 0,
            fieldsOfStudy: (item.subject || []).slice(0, 4),
            keywords: ["Fomento CAPES", ...(item.subject || []).slice(0, 5)],
            language: item.language || "pt",
            sources: [source],
            sourceDetails: {
              "Portal CAPES": {
                externalId: item.DOI,
                url: portalCapesLink
              }
            },
            urls: {
              doiUrl: doi ? `https://doi.org/${doi}` : void 0,
              pdfUrl: pdfLink,
              landingPage: portalCapesLink
            },
            score: {
              bm25: 0,
              morphologicalMatch: 0,
              finalRelevance: 0,
              matchedTerms: []
            }
          });
        }
      } catch (e) {
        console.warn("Error parsing Crossref CAPES payload:", e);
      }
    }
    const bothFailed = (bdtdRes.status === "rejected" || bdtdRes.status === "fulfilled" && !bdtdRes.value.ok) && (crossrefRes.status === "rejected" || crossrefRes.status === "fulfilled" && !crossrefRes.value.ok);
    if (articles.length === 0 && bothFailed) {
      const isRate = bdtdRes.status === "fulfilled" && bdtdRes.value.status === 429 || crossrefRes.status === "fulfilled" && crossrefRes.value.status === 429;
      const isTimeout = bdtdRes.status === "rejected" && (bdtdRes.reason?.name === "AbortError" || bdtdRes.reason?.message?.includes("timeout")) || crossrefRes.status === "rejected" && (crossrefRes.reason?.name === "AbortError" || crossrefRes.reason?.message?.includes("timeout"));
      return {
        source,
        articles: [],
        status: isRate ? "rate-limited" : isTimeout ? "timeout" : "error",
        responseTimeMs: Date.now() - startTime,
        errorMessage: isRate ? "Bloqueio tempor\xE1rio (Portal CAPES HTTP 429)" : isTimeout ? "Tempo limite esgotado (CAPES/BDTD > 4.5s)" : "Falha nos servidores da CAPES/BDTD",
        errorDetail: isRate ? "Servi\xE7os da CAPES/BDTD aplicaram rate limiting tempor\xE1rio de consultas." : isTimeout ? "Servidores da BDTD/IBICT e CAPES n\xE3o responderam dentro do limite de tempo." : "Falha de comunica\xE7\xE3o ou indisponibilidade no cat\xE1logo da BDTD/CAPES."
      };
    }
    return {
      source,
      articles,
      status: "ok",
      responseTimeMs: Date.now() - startTime
    };
  } catch (err) {
    return handleSourceCatchError(source, err, startTime);
  }
}
async function executeFederatedSearch(query, selectedSources = [
  "Portal CAPES",
  "Semantic Scholar",
  "OpenAlex",
  "Crossref",
  "CORE",
  "Europe PMC",
  "arXiv",
  "DOAJ"
], useSemantic = false) {
  const harvestPromises = [];
  if (selectedSources.includes("Portal CAPES")) harvestPromises.push(harvestCAPES(query));
  if (selectedSources.includes("OpenAlex")) harvestPromises.push(harvestOpenAlex(query));
  if (selectedSources.includes("Crossref")) harvestPromises.push(harvestCrossref(query));
  if (selectedSources.includes("Semantic Scholar")) harvestPromises.push(harvestSemanticScholar(query));
  if (selectedSources.includes("Europe PMC")) harvestPromises.push(harvestEuropePMC(query));
  if (selectedSources.includes("arXiv")) harvestPromises.push(harvestArXiv(query));
  if (selectedSources.includes("DOAJ")) harvestPromises.push(harvestDOAJ(query));
  if (selectedSources.includes("CORE")) harvestPromises.push(harvestCORE(query));
  const results = await Promise.allSettled(harvestPromises);
  const sourceStatuses = [];
  let allRawArticles = [];
  for (const res of results) {
    if (res.status === "fulfilled") {
      sourceStatuses.push(res.value);
      allRawArticles.push(...res.value.articles);
    } else {
      sourceStatuses.push({
        source: "Outros",
        articles: [],
        status: "error",
        responseTimeMs: 0,
        errorMessage: res.reason?.message || "Falha na coleta da base",
        errorDetail: "Falha interna inesperada durante a execu\xE7\xE3o da busca"
      });
    }
  }
  const totalFound = allRawArticles.length;
  if (allRawArticles.length === 0) {
    const facets2 = computeFacets([], sourceStatuses);
    return {
      articles: [],
      sourcesStatus: sourceStatuses,
      facets: facets2,
      deduplicatedCount: 0,
      totalFound: 0
    };
  }
  const deduplicated = deduplicateArticles(allRawArticles);
  if (deduplicated.length === 0) {
    const facets2 = computeFacets([], sourceStatuses);
    return {
      articles: [],
      sourcesStatus: sourceStatuses,
      facets: facets2,
      deduplicatedCount: 0,
      totalFound: 0
    };
  }
  const totalDocs = Math.max(deduplicated.length, 1);
  const termDocFrequencies = /* @__PURE__ */ new Map();
  let sumDocLengths = 0;
  for (const doc of deduplicated) {
    const docText = `${doc.title} ${doc.abstract} ${doc.keywords.join(" ")} ${doc.authors.map((a) => a.name).join(" ")}`;
    const tokens = tokenize(docText);
    sumDocLengths += tokens.stems.length;
    const uniqueDocStems = new Set(tokens.stems);
    for (const stem of uniqueDocStems) {
      termDocFrequencies.set(stem, (termDocFrequencies.get(stem) || 0) + 1);
    }
  }
  const avgDocLength = sumDocLengths / totalDocs;
  const scoredArticles = deduplicated.map((doc) => {
    const score = calculateBM25Score(
      query,
      {
        id: doc.id,
        title: doc.title,
        abstract: doc.abstract,
        keywords: doc.keywords,
        fieldsOfStudy: doc.fieldsOfStudy,
        authors: doc.authors.map((a) => a.name),
        citationCount: doc.citationCount
      },
      avgDocLength,
      totalDocs,
      termDocFrequencies,
      useSemantic
    );
    return {
      ...doc,
      score
    };
  });
  scoredArticles.sort((a, b) => b.score.finalRelevance - a.score.finalRelevance);
  const facets = computeFacets(scoredArticles, sourceStatuses);
  return {
    articles: scoredArticles,
    sourcesStatus: sourceStatuses,
    facets,
    deduplicatedCount: scoredArticles.length,
    totalFound
  };
}
function computeFacets(articles, sourceStatuses) {
  const yearCounts = /* @__PURE__ */ new Map();
  const authorCounts = /* @__PURE__ */ new Map();
  const fieldCounts = /* @__PURE__ */ new Map();
  const keywordCounts = /* @__PURE__ */ new Map();
  const langCounts = /* @__PURE__ */ new Map();
  const typeCounts = /* @__PURE__ */ new Map();
  const oaCounts = /* @__PURE__ */ new Map();
  const sourceCounts = /* @__PURE__ */ new Map();
  for (const a of articles) {
    if (a.year) {
      yearCounts.set(a.year, (yearCounts.get(a.year) || 0) + 1);
    }
    for (const author of a.authors.slice(0, 3)) {
      if (author.name && author.name !== "Desconhecido") {
        authorCounts.set(author.name, (authorCounts.get(author.name) || 0) + 1);
      }
    }
    for (const f of a.fieldsOfStudy) {
      fieldCounts.set(f, (fieldCounts.get(f) || 0) + 1);
    }
    for (const k of a.keywords) {
      keywordCounts.set(k, (keywordCounts.get(k) || 0) + 1);
    }
    const lang = a.language || "en";
    langCounts.set(lang, (langCounts.get(lang) || 0) + 1);
    typeCounts.set(a.publicationType, (typeCounts.get(a.publicationType) || 0) + 1);
    const oaKey = a.openAccess.isOpen ? a.openAccess.status || "gold" : "closed";
    oaCounts.set(oaKey, (oaCounts.get(oaKey) || 0) + 1);
    for (const s of a.sources) {
      sourceCounts.set(s, (sourceCounts.get(s) || 0) + 1);
    }
  }
  const mapToSortedFacet = (map, labelMapper) => {
    return Array.from(map.entries()).map(([val, count]) => ({
      value: val,
      label: labelMapper ? labelMapper(val) : val,
      count
    })).sort((a, b) => b.count - a.count);
  };
  const years = Array.from(yearCounts.entries()).map(([year, count]) => ({ year, count })).sort((a, b) => b.year - a.year);
  const langLabels = {
    pt: "Portugu\xEAs",
    es: "Espa\xF1ol (Espanhol)",
    en: "English (Ingl\xEAs)",
    fr: "Fran\xE7ais (Franc\xEAs)",
    de: "Deutsch (Alem\xE3o)",
    it: "Italiano"
  };
  const typeLabels = {
    "journal-article": "Artigo de Peri\xF3dico",
    "proceedings-article": "Artigo de Evento / Anais",
    "preprint": "Preprint (arXiv / SSRN)",
    "thesis": "Tese / Disserta\xE7\xE3o",
    "book-chapter": "Livro / Cap\xEDtulo",
    "review": "Revis\xE3o Sistem\xE1tica",
    "other": "Outros Documentos"
  };
  const oaLabels = {
    gold: "Ouro (Gold OA - Direto na Revista)",
    green: "Verde (Green OA - Reposit\xF3rio Institucional)",
    bronze: "Bronze (Acesso Livre na Editora)",
    hybrid: "H\xEDbrido (Peri\xF3dico Pago com Artigo OA)",
    closed: "Acesso Restrito / Assinatura"
  };
  const allSources = [
    "Portal CAPES",
    "Semantic Scholar",
    "OpenAlex",
    "Crossref",
    "CORE",
    "Europe PMC",
    "arXiv",
    "DOAJ"
  ];
  const sourceFacet = allSources.map((s) => {
    const statusObj = sourceStatuses.find((st) => st.source === s);
    return {
      source: s,
      count: sourceCounts.get(s) || 0,
      available: statusObj ? statusObj.status === "ok" : true
    };
  });
  return {
    years,
    authors: mapToSortedFacet(authorCounts).slice(0, 15),
    fields: mapToSortedFacet(fieldCounts).slice(0, 15),
    keywords: mapToSortedFacet(keywordCounts).slice(0, 20),
    languages: mapToSortedFacet(langCounts, (v) => langLabels[v] || v.toUpperCase()),
    publicationTypes: mapToSortedFacet(typeCounts, (v) => typeLabels[v] || v),
    openAccess: mapToSortedFacet(oaCounts, (v) => oaLabels[v] || v),
    sources: sourceFacet
  };
}

// server/copilot.ts
var import_genai = require("@google/genai");

// server/unila_service.ts
async function fetchUnilaEditais(query, category, limit = 8) {
  try {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 6e3);
    const res = await fetch("https://documentos.unila.edu.br/?items_per_page=60", {
      headers: {
        "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.0.0 Safari/537.36",
        "Accept": "text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8"
      },
      signal: controller.signal
    });
    clearTimeout(timeout);
    if (!res.ok) {
      throw new Error(`HTTP ${res.status}`);
    }
    const html = await res.text();
    const editais = [];
    const trMatches = [...html.matchAll(/<tr[^>]*>([\s\S]*?)<\/tr>/gi)];
    for (let i = 1; i < trMatches.length; i++) {
      const rowHtml = trMatches[i][1];
      const linkMatch = rowHtml.match(/href="([^"]+)"/i);
      const cells = [...rowHtml.matchAll(/<td[^>]*>([\s\S]*?)<\/td>/gi)].map(
        (m) => m[1].replace(/<[^>]+>/g, " ").replace(/\s+/g, " ").trim()
      );
      if (cells.length >= 7) {
        const number = cells[0] || "";
        const year = cells[1] || "";
        const title = cells[2] || "";
        const isNew = (cells[3] || "").toLowerCase().includes("novo");
        const type = cells[4] || "Geral";
        const unit = cells[5] || "UNILA";
        const pubDate = cells[7] || cells[6] || "";
        const updateDate = cells[8] || void 0;
        let relativeUrl = linkMatch ? linkMatch[1] : "";
        if (relativeUrl.startsWith("/")) {
          relativeUrl = `https://documentos.unila.edu.br${relativeUrl}`;
        } else if (!relativeUrl.startsWith("http")) {
          relativeUrl = `https://documentos.unila.edu.br/${relativeUrl}`;
        }
        editais.push({
          id: `edital-${year}-${number}-${i}`,
          number,
          year,
          title,
          category: type,
          unit,
          publishDate: pubDate,
          updateDate,
          url: relativeUrl || "https://portal.unila.edu.br/editais",
          isNew
        });
      }
    }
    let filtered = editais;
    if (query && query.trim()) {
      const qLower = query.toLowerCase().trim();
      const qTerms = qLower.split(/\s+/).filter((t) => t.length > 2);
      filtered = filtered.filter((ed) => {
        const fullText = `${ed.number} ${ed.year} ${ed.title} ${ed.category} ${ed.unit}`.toLowerCase();
        return qTerms.some((term) => fullText.includes(term));
      });
    }
    if (category && category.trim()) {
      const catLower = category.toLowerCase().trim();
      filtered = filtered.filter(
        (ed) => ed.category.toLowerCase().includes(catLower) || ed.unit.toLowerCase().includes(catLower)
      );
    }
    return filtered.slice(0, limit);
  } catch (err) {
    console.warn("Erro ao consultar https://documentos.unila.edu.br:", err.message);
    return getFallbackUnilaEditais(query);
  }
}
async function fetchUnilaNews(query, limit = 5) {
  try {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 6e3);
    const res = await fetch("https://portal.unila.edu.br/noticias", {
      headers: {
        "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36"
      },
      signal: controller.signal
    });
    clearTimeout(timeout);
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const html = await res.text();
    const news = [];
    const articleMatches = [...html.matchAll(/<article[^>]*>([\s\S]*?)<\/article>/gi)];
    for (let i = 0; i < articleMatches.length; i++) {
      const artHtml = articleMatches[i][1];
      const titleMatch = artHtml.match(/<h2[^>]*>[\s\S]*?<a[^>]*href="([^"]+)"[^>]*>([\s\S]*?)<\/a>/i);
      const descMatch = artHtml.match(/<p class="description"[^>]*>([\s\S]*?)<\/p>/i);
      const dateMatch = artHtml.match(/<time[^>]*>([\s\S]*?)<\/time>/i);
      if (titleMatch) {
        const url = titleMatch[1];
        const title = titleMatch[2].replace(/<[^>]+>/g, "").trim();
        const summary = descMatch ? descMatch[1].replace(/<[^>]+>/g, "").trim() : "";
        const date = dateMatch ? dateMatch[1].replace(/<[^>]+>/g, "").trim() : "";
        news.push({
          id: `news-${i}`,
          title,
          summary,
          url,
          date
        });
      }
    }
    let filtered = news;
    if (query && query.trim()) {
      const qLower = query.toLowerCase();
      filtered = filtered.filter(
        (n) => n.title.toLowerCase().includes(qLower) || n.summary.toLowerCase().includes(qLower)
      );
    }
    return filtered.slice(0, limit);
  } catch (err) {
    console.warn("Erro ao consultar not\xEDcias da UNILA:", err.message);
    return [];
  }
}
function getFallbackUnilaEditais(query) {
  const defaults = [
    {
      id: "edital-2026-108",
      number: "108",
      year: "2026",
      title: "PAPADE 2026: Torna p\xFAblico o resultado preliminar da sele\xE7\xE3o do Programa de Apoio \xE0 Participa\xE7\xE3o Discente em Eventos cient\xEDficos, art\xEDsticos-culturais e de extens\xE3o da UNILA",
      category: "Gradua\xE7\xE3o / Apoio Discente",
      unit: "PROGRAD",
      publishDate: "15/09/2026",
      url: "https://documentos.unila.edu.br/editais/prograd/108-7",
      isNew: true
    },
    {
      id: "edital-2026-025",
      number: "025",
      year: "2026",
      title: "EDITAL N\xBA 25/2026 \u2013 PPGIES/ILATIT PROCESSO SELETIVO PARA ALUNOS(AS) 2027.1 DOUTORADO INTERDISCIPLINAR EM ENERGIA E SUSTENTABILIDADE",
      category: "P\xF3s-Gradua\xE7\xE3o / Doutorado",
      unit: "P\xD3S-GRADUA\xC7\xC3O PPG-IES",
      publishDate: "14/09/2026",
      url: "https://documentos.unila.edu.br/editais/p-s-gradua-o-ppg-ies/25-4",
      isNew: true
    },
    {
      id: "edital-2026-024",
      number: "024",
      year: "2026",
      title: "EDITAL N\xBA 24/2026 - PPGIES/ILATIT PROCESSO SELETIVO PARA ALUNOS(AS) 2027.1 MESTRADO INTERDISCIPLINAR EM ENERGIA E SUSTENTABILIDADE",
      category: "P\xF3s-Gradua\xE7\xE3o / Mestrado",
      unit: "P\xD3S-GRADUA\xC7\xC3O PPG-IES",
      publishDate: "14/09/2026",
      url: "https://documentos.unila.edu.br/editais/p-s-gradua-o-ppg-ies/24-5",
      isNew: true
    },
    {
      id: "edital-2026-013",
      number: "013",
      year: "2026",
      title: "EDITAL N\xBA 013/2026/PPGICAL - PROCESSO SELETIVO MESTRADO - ALUNO REGULAR - TURMA 2027",
      category: "P\xF3s-Gradua\xE7\xE3o / Mestrado",
      unit: "P\xD3S-GRADUA\xC7\xC3O PPG-ICAL",
      publishDate: "14/09/2026",
      url: "https://documentos.unila.edu.br/editais/p-s-gradua-o-ppg-ical/13-3",
      isNew: true
    },
    {
      id: "edital-2026-029",
      number: "029",
      year: "2026",
      title: "EDITAL N\xBA 29/2026/PRPPG - SELE\xC7\xC3O DE BOLSAS DE INICIA\xC7\xC3O CIENT\xCDFICA E TECNOL\xD3GICA (PIBIC/PIBITI/PIBIC-Af) UNILA",
      category: "Pesquisa e Inova\xE7\xE3o",
      unit: "PRPPG",
      publishDate: "10/09/2026",
      url: "https://documentos.unila.edu.br/editais/prppg/29-1",
      isNew: false
    }
  ];
  if (!query || !query.trim()) return defaults;
  const q = query.toLowerCase();
  return defaults.filter(
    (d) => d.title.toLowerCase().includes(q) || d.category.toLowerCase().includes(q) || d.unit.toLowerCase().includes(q)
  );
}

// server/copilot.ts
var aiClient = null;
function getAiClient() {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) return null;
  if (!aiClient) {
    aiClient = new import_genai.GoogleGenAI({
      apiKey,
      httpOptions: {
        headers: {
          "User-Agent": "aistudio-build"
        }
      }
    });
  }
  return aiClient;
}
var BEHAVIOR_INSTRUCTIONS = {
  epistemologia_falibilista: {
    id: "epistemologia_falibilista",
    name: "epistemologia_falibilista",
    title: "Postura Epistemol\xF3gica Falibilista e Negativista",
    summary: "Abordagem cient\xEDfica rigorosa baseada em Popper e falseacionismo, distin\xE7\xE3o estrita de fatos, evid\xEAncias, hip\xF3teses, modelos e teorias, e exame sistem\xE1tico dos limites do conhecimento.",
    relevanceKeywords: ["epistemologia", "falibilista", "negativista", "popper", "falseabilidade", "refutacao", "ciencia", "teoria", "hipotese", "modelo", "fato", "consenso"],
    content: `[EXTENS\xC3O DE COMPORTAMENTO: EPISTEMOLOGIA FALIBILISTA E NEGATIVISTA]
Atue como pesquisadora cient\xEDfica de postura falibilista e epistemologicamente negativista: conhecimento cient\xEDfico, modelos, teorias e consensos acad\xEAmicos n\xE3o s\xE3o verdades finais dogm\xE1ticas, mas constru\xE7\xF5es provis\xF3rias refut\xE1veis e continuamente test\xE1veis. N\xE3o negue o conhecimento estabelecido; teste seus limites, pressupostos t\xE1citos e condi\xE7\xF5es de validade.

CATEGORIZA\xC7\xC3O EPISTEMOL\xD3GICA RIGOROSA:
Ao analisar qualquer afirma\xE7\xE3o, resultado emp\xEDrico ou modelo cient\xEDfico, diferencie com precis\xE3o:
- observa\xE7\xE3o/fato (dado bruto mensurado na realidade observ\xE1vel);
- evid\xEAncia (fato contextualizado e submetido a teste em rela\xE7\xE3o a uma hip\xF3tese);
- infer\xEAncia/interpreta\xE7\xE3o (ponte l\xF3gica e dedu\xE7\xE3o elaborada pelo pesquisador);
- hip\xF3tese (proposi\xE7\xE3o false\xE1vel ainda sujeita a escrut\xEDnio experimental);
- modelo (simplifica\xE7\xE3o formal da realidade para fins de explica\xE7\xE3o ou predi\xE7\xE3o);
- teoria (conjunto estruturado e corroborado de hip\xF3teses e leis);
- consenso (converg\xEAncia provis\xF3ria da comunidade de pares em dado momento hist\xF3rico);
- especula\xE7\xE3o (conjectura n\xE3o false\xE1vel ou sem base emp\xEDrica demonstrada).

AS 6 PERGUNTAS SISTEM\xC1TICAS:
1. O que foi realmente observado ou demonstrado empiricamente?
2. Quais pressupostos conceituais e metodol\xF3gicos sustentam a conclus\xE3o?
3. Que evid\xEAncia contr\xE1ria poderia falsear ou refutar a tese?
4. Quais limita\xE7\xF5es metodol\xF3gicas, instrumentais ou amostrais existem?
5. Quais hip\xF3teses ou explica\xE7\xF5es alternativas s\xE3o compat\xEDveis com os dados?
6. O que permanece desconhecido ou n\xE3o resolvido?

PRINC\xCDPIOS DEMARCAT\xD3RIOS DE VALIDADE:
- \u201Cn\xE3o h\xE1 evid\xEAncia suficiente\u201D \u2260 \u201C\xE9 falso\u201D;
- \u201Cn\xE3o foi demonstrado\u201D \u2260 \u201C\xE9 imposs\xEDvel\u201D;
- \u201Cexplica os dados atuais\u201D \u2260 \u201C\xE9 a realidade definitiva\u201D.
Quando houver conflito entre evid\xEAncias, apresente-o com neutralidade cient\xEDfica. Quando uma hip\xF3tese n\xE3o puder ser testada, classifique-a como especulativa. Quando os dados forem inconclusivos, declare a incerteza.`
  },
  orientacao_interface_seletores: {
    id: "orientacao_interface_seletores",
    name: "orientacao_interface_seletores",
    title: "Orienta\xE7\xE3o Visual de Interface e Mapeamento de Seletores",
    summary: "Mapeamento completo dos seletores e IDs dos elementos da interface da plataforma e regras de uso da ferramenta highlight_element.",
    relevanceKeywords: ["interface", "destaque", "onde fica", "onde encontrar", "botao", "filtro", "repositorio", "tela", "pagina", "seletor", "elemento", "destacar"],
    content: `[EXTENS\xC3O DE COMPORTAMENTO: ORIENTA\xC7\xC3O VISUAL DE INTERFACE E SELETORES]
Utilize a ferramenta 'highlight_element' para destacar visualmente componentes na interface da p\xE1gina com anel luminoso animado e exibir caixa orientadora sempre que o usu\xE1rio perguntar onde fica, como usar, trocar ou interagir com um elemento da aplica\xE7\xE3o.

MAPEAMENTO COMPLETO DE ELEMENTOS (elementId):
- Barra de Reposit\xF3rios Cient\xEDficos: 'repository-selectors-bar'
- Se\xE7\xE3o de Vitrine das 8 Bases: 'eight-bases-showcase-section'
- Reposit\xF3rio OpenAlex: 'repository-item-openalex'
- Reposit\xF3rio Crossref: 'repository-item-crossref'
- Reposit\xF3rio CORE: 'repository-item-core'
- Reposit\xF3rio arXiv: 'repository-item-arxiv'
- Reposit\xF3rio Europe PMC: 'repository-item-europepmc'
- Reposit\xF3rio Semantic Scholar: 'repository-item-semanticscholar'
- Reposit\xF3rio DOAJ: 'repository-item-doaj'
- Reposit\xF3rio Portal de Peri\xF3dicos CAPES: 'repository-item-portalcapes'
- Campo de Busca Principal: 'search-bar-input'
- Bot\xE3o de Executar Busca: 'search-submit-btn'
- Chips de Sugest\xF5es de Pesquisa: 'search-suggestions-chips'
- Container de Sugest\xF5es: 'search-suggestions-container'
- T\xF3picos Sugeridos: 'featured-suggestions-topics'
- Barra Lateral de Filtros (Desktop): 'desktop-filter-sidebar'
- Alternador de Apenas Acesso Aberto: 'open-access-toggle-btn'
- Alternador de Artigos com PDF: 'pdf-only-toggle-btn'
- Alternador de Busca Sem\xE2ntica: 'semantic-toggle-btn'
- Filtro de Anos (Intervalo Temporal): 'filter-section-years'
- Filtro de Fontes/Bases: 'filter-section-sources'
- Filtro de \xC1reas do Conhecimento: 'filter-section-fields'
- Filtro de Autores: 'filter-section-authors'
- Filtro de Tipos de Publica\xE7\xE3o: 'filter-section-types'
- Filtro de Idiomas dos Artigos: 'filter-section-languages'
- Bot\xE3o Limpar Filtros: 'filter-clear-all-btn'
- Coluna de Resultados: 'results-feed-column'
- Banner de Contagem de Artigos: 'results-count-banner'
- Seletor de Ordena\xE7\xE3o: 'sort-by-select'
- Primeiro Artigo da Lista: 'first-article-card'
- Bot\xE3o de Artigos Salvos: 'saved-articles-btn'
- Seletor de Idioma da Interface: 'topbar-language-selector'
- T\xEDtulo do Portal / Logo da UNILA: 'portal-title', 'unila-portal-logo-link'
- Barra de Navega\xE7\xE3o Institucional: 'institutional-horizontal-nav'

DIRETRIZES DE DESTAQUE:
Sempre preencha 'elementId', 'title' conciso e 'description' pedag\xF3gica para o usu\xE1rio. Ofere\xE7a 'quickPrompts' opcionais com a\xE7\xF5es r\xE1pidas para o elemento selecionado.`
  },
  redacao_abnt_tcc: {
    id: "redacao_abnt_tcc",
    name: "redacao_abnt_tcc",
    title: "Reda\xE7\xE3o Acad\xEAmica, Normas ABNT e Estrutura\xE7\xE3o de TCC",
    summary: "Diretrizes para TCC, monografias, disserta\xE7\xF5es, artigos acad\xEAmicos, fichamentos e normas ABNT NBR 6028, NBR 10520 e NBR 6023.",
    relevanceKeywords: ["abnt", "tcc", "monografia", "dissertacao", "citacao", "referencia", "nbr", "fichamento", "resumo", "redacao academica", "artigo cientifico"],
    content: `[EXTENS\xC3O DE COMPORTAMENTO: REDA\xC7\xC3O ACAD\xCAMICA, ABNT E TCC]
Atue como orientadora acad\xEAmica experiente, guiando o pesquisador em todas as fases da reda\xE7\xE3o de Trabalhos de Conclus\xE3o de Curso (TCC), disserta\xE7\xF5es e artigos.

ESTRUTURA CAN\xD4NICA DE TRABALHOS ACAD\xCAMICOS:
1. Introdu\xE7\xE3o: Delimita\xE7\xE3o tem\xE1tica precisa, formula\xE7\xE3o clara do problema de pesquisa (pergunta norteadora), justificativa (relev\xE2ncia acad\xEAmica, social e pr\xE1tica), hip\xF3teses e objetivos (geral e espec\xEDficos).
2. Revis\xE3o de Literatura / Estado da Arte: Di\xE1logo cr\xEDtico e articulado entre autores centrais, evolu\xE7\xE3o hist\xF3rica dos conceitos, consensos estabelecidos e lacunas te\xF3ricas identificadas.
3. Metodologia: Abordagem (qualitativa, quantitativa ou mista), tipologia (explorat\xF3ria, descritiva, explicativa), procedimentos t\xE9cnicos (revis\xE3o bibliogr\xE1fica, estudo de caso, pesquisa experimental, levantamento), universo e amostragem, t\xE9cnicas de coleta e m\xE9todo de an\xE1lise de dados.
4. Resultados e Discuss\xE3o: Apresenta\xE7\xE3o rigorosa dos achados emp\xEDricos confrontados diretamente com a literatura revisada.
5. Conclus\xE3o / Considera\xE7\xF5es Finais: Resposta expl\xEDcita ao problema de pesquisa, explicita\xE7\xE3o de limita\xE7\xF5es do estudo e proposi\xE7\xE3o de novos desdobramentos de pesquisa.

NORMAS T\xC9CNICAS ABNT OBRIGAT\xD3RIAS:
- ABNT NBR 10520 (Cita\xE7\xF5es):
  * Cita\xE7\xE3o Direta Curta (at\xE9 3 linhas): Inserida no fluxo do par\xE1grafo, entre aspas duplas. Exemplo: Conforme Silva (2023, p. 45), "a ci\xEAncia opera pela falseabilidade das hip\xF3teses". Ou: "A ci\xEAncia opera pela falseabilidade das hip\xF3teses" (SILVA, 2023, p. 45).
  * Cita\xE7\xE3o Direta Longa (mais de 3 linhas): Par\xE1grafo isolado com recuo de 4 cm da margem esquerda, fonte tamanho 10 pt, espa\xE7amento simples entre linhas, sem aspas, com indica\xE7\xE3o formal ao final: (SOBRENOME, ano, p. XX).
  * Cita\xE7\xE3o Indireta (Par\xE1frase): Redigida com as pr\xF3prias palavras respeitando a ideia original do autor consultado. N\xE3o exige n\xFAmero de p\xE1gina: Conforme apontado por Santos (2022) ou (SANTOS, 2022).
  * Apud (Cita\xE7\xE3o de segunda m\xE3o): Autor original (ano apud Autor da obra consultada, ano, p. p\xE1gina). Usar com modera\xE7\xE3o, apenas quando a fonte prim\xE1ria for inacess\xEDvel.
- ABNT NBR 6023 (Refer\xEAncias Bibliogr\xE1ficas):
  * Artigo em peri\xF3dico: SOBRENOME, Nome. T\xEDtulo do artigo. **Nome do Peri\xF3dico em negrito**, cidade, v. X, n. Y, p. xx-yy, m\xEAs ano. DOI.
  * Livro: SOBRENOME, Nome. **T\xEDtulo da obra em negrito**: subt\xEDtulo sem negrito. Edi\xE7\xE3o. Cidade: Editora, ano.
- ABNT NBR 6028 (Resumos):
  * Par\xE1grafo \xFAnico, voz ativa na 3\xAA pessoa do singular, entre 150 e 500 palavras (TCC) ou 100 a 250 palavras (artigo), com 3 a 5 palavras-chave separadas por ponto e v\xEDrgula.`
  },
  institucional_editais_unila: {
    id: "institucional_editais_unila",
    name: "institucional_editais_unila",
    title: "Informa\xE7\xF5es Institucionais da UNILA e Editais Oficiais",
    summary: "Hist\xF3rico, miss\xE3o de integra\xE7\xE3o latino-americana e caribenha, cursos, institutos da UNILA e procedimentos de consulta a editais oficiais.",
    relevanceKeywords: ["unila", "edital", "editais", "bolsa", "pibic", "prograd", "prppg", "instituto", "foz do iguacu", "ilaach", "ilaesp", "ilatit", "ilacvn", "ju", "pti"],
    content: `[EXTENS\xC3O DE COMPORTAMENTO: INSTITUCIONAL UNILA E EDITAIS OFICIAIS]
A UNILA (Universidade Federal da Integra\xE7\xE3o Latino-Americana) \xE9 uma universidade p\xFAblica federal brasileira criada pela Lei n\xBA 12.189 de 12 de janeiro de 2010, com sede em Foz do Igua\xE7u, Estado do Paran\xE1 (regi\xE3o da Tr\xEDplice Fronteira entre Brasil, Paraguai e Argentina).

MISS\xC3O INSTITUCIONAL:
Promover a integra\xE7\xE3o solid\xE1ria latino-americana e caribenha, o desenvolvimento regional e o interc\xE2mbio cultural, cient\xEDfico e educacional, mediante ensino, pesquisa e extens\xE3o bilingues (portugu\xEAs e espanhol) e interculturalidade cr\xEDtica.

ESTRUTURA ACAD\xCAMICA - INSTITUTOS:
- ILAACH: Instituto Latino-Americano de Arte, Cultura e Hist\xF3ria (Cinema e Audiovisual, M\xFAsica, Artes Visuais, Hist\xF3ria, Antropologia, Filosofia, Letras - Espanhol e Portugu\xEAs como L\xEDngua Estrangeira, Media\xE7\xE3o Cultural).
- ILAESP: Instituto Latino-Americano de Economia, Sociedade e Pol\xEDtica (Rela\xE7\xF5es Internacionais e Integra\xE7\xE3o, Ci\xEAncias Econ\xF4micas, Administra\xE7\xE3o P\xFAblica, Ci\xEAncia Pol\xEDtica e Sociologia, Servi\xE7o Social, Desenvolvimento Rural).
- ILATIT: Instituto Latino-Americano de Tecnologia, Infraestrutura e Territ\xF3rio (Engenharias Civil, Energia, Qu\xEDmica, F\xEDsica, Materiais, Arquitetura e Urbanismo, Geografia).
- ILACVN: Instituto Latino-Americano de Ci\xEAncias da Vida e da Natureza (Medicina, Biotecnologia, Ci\xEAncias Biol\xF3gicas, Sa\xFAde Coletiva, Qu\xEDmica, Ci\xEAncias da Natureza).

UNIDADES E CAMPI:
- Unidade Jardim Universit\xE1rio (JU): Av. Tarqu\xEDnio Joslin dos Santos, 1000.
- Unidade PTI (Parque Tecnol\xF3gico Itaipu): Instalada na Usina Hidrel\xE9trica de Itaipu.
- Campus Integra\xE7\xE3o: Projeto arquitet\xF4nico de Oscar Niemeyer.

FONTES E SISTEMA DE EDITAIS:
- Portal Institucional Oficial: https://portal.unila.edu.br
- Documentos e Editais Oficiais: https://documentos.unila.edu.br e https://portal.unila.edu.br/editais
- Pr\xF3-Reitorias de Destaque:
  * PROGRAD: Gradua\xE7\xE3o, processos seletivos (SISU e Processo Seletivo Internacional - PSI), matr\xEDculas e mobilidade.
  * PRPPG: P\xF3s-Gradua\xE7\xE3o, programas de mestrado e doutorado, pesquisa e bolsas PIBIC/PIBITI/PIBIC-Af.
  * PRAE: Pr\xF3-Reitoria de Assuntos Estudantis, aux\xEDlios moradia, alimenta\xE7\xE3o e transporte para estudantes vulner\xE1veis.
  * PROEX: Extens\xE3o universit\xE1ria e integra\xE7\xE3o comunit\xE1ria regional.

FERRAMENTA ASSOCIADA:
Para exibir editais vigentes, bolsas ou processos seletivos diretamente no chat para o usu\xE1rio, chame a ferramenta 'search_unila_editais'.`
  },
  analise_artigo_metodologia: {
    id: "analise_artigo_metodologia",
    name: "analise_artigo_metodologia",
    title: "An\xE1lise Cr\xEDtica de Artigos Cient\xEDficos e Metodologia",
    summary: "Crit\xE9rios metodol\xF3gicos para examinar o rigor, amostragens, vieses, limita\xE7\xF5es e resultados de estudos acad\xEAmicos com read_article_full_content.",
    relevanceKeywords: ["artigo", "paper", "estudo", "amostra", "metodologia", "limitacao", "vies", "ensaio", "analise de artigo", "revisao sistematica"],
    content: `[EXTENS\xC3O DE COMPORTAMENTO: AN\xC1LISE CR\xCDTICA DE ARTIGOS CIENT\xCDFICOS]
Ao examinar estudos cient\xEDficos ou apoiar revis\xF5es bibliogr\xE1ficas sistem\xE1ticas, aplique crit\xE9rios anal\xEDticos aprofundados e rigorosos:

CRIT\xC9RIOS DE AVALIA\xC7\xC3O METODOL\xD3GICA:
1. Formula\xE7\xE3o do Problema: O escopo e os objetivos da pesquisa est\xE3o claramente demarcados e justificados na introdu\xE7\xE3o?
2. Delineamento do Estudo: O modelo (ensaio controlado, estudo de coorte, caso-controle, transversal, modelagem matem\xE1tica, pesquisa documental) \xE9 adequado para responder \xE0 hip\xF3tese?
3. Amostragem e Sujeitos: O tamanho amostral (N) possui poder estat\xEDstico adequado? Houve randomiza\xE7\xE3o ou controle de vi\xE9s de sele\xE7\xE3o? Quais os crit\xE9rios expl\xEDcitos de inclus\xE3o/exclus\xE3o?
4. Controle de Vari\xE1veis de Confus\xE3o: Como foram controladas vari\xE1veis intervenientes? Houve cegamento quando aplic\xE1vel?
5. Validade Interna vs. Externa: As ferramentas de medi\xE7\xE3o foram calibradas ou validadas? Os resultados podem ser generalizados ou s\xE3o contingentes ao recorte espec\xEDfico?
6. Conflito de Interesses e Vi\xE9s de Publica\xE7\xE3o: H\xE1 ind\xEDcios de financiamento que possa enviesar conclus\xF5es ou aus\xEAncia de relato sobre desfechos negativos?
7. Limita\xE7\xF5es Declaradas vs. Ocultas: O que os autores admitiram abertamente como limita\xE7\xE3o e quais pontos fr\xE1geis metodol\xF3gicos n\xE3o foram declarados?

FERRAMENTAS ASSOCIADAS:
- 'read_article_full_content': Chame para examinar detalhadamente o resumo completo, metodologia e metadados de artigos abertos ou selecionados na aplica\xE7\xE3o.
- 'search_academic_repositories': Chame APENAS quando o usu\xE1rio solicitar expressamente busca, listagem ou recomenda\xE7\xE3o de artigos.`
  },
  formatacao_pdf_modal: {
    id: "formatacao_pdf_modal",
    name: "formatacao_pdf_modal",
    title: "Formata\xE7\xE3o de Documentos Cient\xEDficos, PDF e Visualizador Modal",
    summary: "Regras de inser\xE7\xE3o dos marcadores especiais [ENABLE_ACADEMIC_PDF] e [ENABLE_MODAL_VIEWER] para minutas formais e leitura expandida.",
    relevanceKeywords: ["pdf", "modal", "imprimir", "baixar", "documento", "resenha", "minuta", "exportar", "formatacao", "diagramacao"],
    content: `[EXTENS\xC3O DE COMPORTAMENTO: FORMATA\xC7\xC3O PDF E MODAL ACAD\xCAMICO]
Diretrizes para acionamento de controles visuais avan\xE7ados na interface da aplica\xE7\xE3o durante a produ\xE7\xE3o de textos acad\xEAmicos formais.

MARCADORES VISUAIS ESPECIAIS:
- '[ENABLE_ACADEMIC_PDF]': Deve ser inserido no in\xEDcio de respostas acad\xEAmicas formais e estruturadas (como minutas completas de artigos, s\xEDnteses de literatura, projetos de pesquisa ou resenhas detalhadas). Este marcador orienta a interface a exibir um bot\xE3o de 'Exportar Artigo em PDF' com diagrama\xE7\xE3o em duas colunas, tipografia serifada e cabe\xE7alho acad\xEAmico oficial.
- '[ENABLE_MODAL_VIEWER]': Deve ser inserido para textos longos e densos que exigem leitura focada e imersiva em tela cheia na interface da p\xE1gina.

RESTRI\xC7\xC3O MANDAT\xD3RIA:
NUNCA insira [ENABLE_ACADEMIC_PDF] ou [ENABLE_MODAL_VIEWER] em sauda\xE7\xF5es, conversas casuais, respostas simples de poucas palavras, orienta\xE7\xF5es r\xE1pidas de bot\xF5es da interface ou contas matem\xE1ticas. Reserve estritamente para produ\xE7\xE3o textual acad\xEAmica substantiva.`
  }
};
function getBehaviorInstruction(instructionName) {
  if (!instructionName) return null;
  const key = instructionName.trim().toLowerCase().replace(/['"]/g, "");
  if (BEHAVIOR_INSTRUCTIONS[key]) {
    return BEHAVIOR_INSTRUCTIONS[key];
  }
  for (const [id, mod] of Object.entries(BEHAVIOR_INSTRUCTIONS)) {
    if (key.includes(id) || id.includes(key)) return mod;
    if (mod.relevanceKeywords.some((kw) => key.includes(kw))) return mod;
  }
  return null;
}
var BEHAVIOR_CATALOG_SUMMARY = Object.values(BEHAVIOR_INSTRUCTIONS).map((mod) => `- \`${mod.name}\`: ${mod.summary}`).join("\n");
var BASE_SYSTEM_INSTRUCTION = `Voc\xEA \xE9 Sophia, a Intelig\xEAncia Artificial e Co-pilot Cient\xEDfica Oficial da Busca Acad\xEAmica Integrada da UNILA (Universidade Federal da Integra\xE7\xE3o Latino-Americana). Voc\xEA atua como pesquisadora cient\xEDfica, orientadora acad\xEAmica e copiloto inteligente da plataforma.

CALIBRA\xC7\xC3O DE EXTENS\xC3O E ESTILO DA RESPOSTA:
1. MENSAGENS OU PERGUNTAS PONTUAIS E DO COTIDIANO:
   - Para sauda\xE7\xF5es ("ol\xE1", "bom dia"), perguntas breves, amenidades, confirma\xE7\xF5es pontuais, c\xE1lculos simples ou d\xFAvidas r\xE1pidas do cotidiano: responda sempre em POUCAS PALAVRAS (1 a 3 frases curtas), com tom acolhedor, objetivo e gentil. N\xE3o gere par\xE1grafos longos, n\xE3o use listas prolixas e n\xE3o consulte instru\xE7\xF5es densas para intera\xE7\xF5es cotidianas.
2. QUEST\xD5ES QUE REQUEREM MAIS EXPLICA\xC7\xD5ES OU APROFUNDAMENTO:
   - Para d\xFAvidas conceituais, an\xE1lises epistemol\xF3gicas, metodologia de pesquisa, elabora\xE7\xE3o de TCC, explica\xE7\xF5es sobre a UNILA/editais, an\xE1lises de artigos ou reda\xE7\xE3o formal: responda com PROFUNDIDADE e RIQUEZA DE MARKDOWN (t\xEDtulos com '#' e '##', subt\xEDtulos, listas de t\xF3picos com marcadores '-', negrito em termos centrais, tabelas comparativas e caixas estruturadas), formulando explica\xE7\xF5es completas, did\xE1ticas e rigorosas.

ARQUITETURA MODULAR: EXTENS\xD5ES DE COMPORTAMENTO SOB DEMANDA
Para manter a aplica\xE7\xE3o r\xE1pida e enxuta, o conte\xFAdo integral das diretrizes especializadas fica FORA deste prompt-base. Voc\xEA disp\xF5e apenas do cat\xE1logo leve com nome e resumo curto abaixo:

CAT\xC1LOGO DE EXTENS\xD5ES DISPON\xCDVEIS:
${BEHAVIOR_CATALOG_SUMMARY}

COMO CONSULTAR CADA INSTRU\xC7\xC3O:
1. Analise o pedido do usu\xE1rio e avalie se alguma extens\xE3o \xE9 necess\xE1ria.
2. Chame 'consult_behavior_instruction' passando o 'instruction_name' exato.
3. Avalie se o conte\xFAdo retornado \xE9 relevante e suficiente para a resposta.
4. Se for insuficiente, incompleto ou se o tema envolver mais de uma \xE1rea (ex: epistemologia combinada com normas da ABNT, ou interface combinada com editais), CONSULTE NOVAMENTE outras instru\xE7\xF5es quantas vezes forem necess\xE1rias antes de emitir a resposta final.

FERRAMENTAS COMPLEMENTARES:
- 'search_academic_repositories': Use para buscar em tempo real nas bases acad\xEAmicas federadas e exibir os artigos cient\xEDficos encontrados. Sincroniza tanto na tela quanto no chat.
- 'execute_page_search': Dispara a pesquisa acad\xEAmica unificada atualizando o campo de busca e a coluna de resultados na tela da aplica\xE7\xE3o para o usu\xE1rio.
- 'search_unila_editais': Use para consultar e exibir editais e processos seletivos da UNILA.
- 'highlight_element': Use para destacar visualmente bot\xF5es, filtros e se\xE7\xF5es da interface quando solicitado ou ao guiar o usu\xE1rio.
IMPORTANTE: Sempre que o usu\xE1rio pedir para procurar, buscar ou pesquisar artigos, papers ou temas cient\xEDficos, invoque imediatamente 'search_academic_repositories' ou 'execute_page_search'. Nunca responda como se tivesse pesquisado sem ter executado a ferramenta!`;
var COPILOT_TOOLS = [
  {
    functionDeclarations: [
      {
        name: "consult_behavior_instruction",
        description: "Consulta uma extens\xE3o de comportamento especializada para aprofundar as diretrizes de atua\xE7\xE3o da IA. Chame esta ferramenta para carregar instru\xE7\xF5es completas sobre: 'epistemologia_falibilista', 'orientacao_interface_seletores', 'redacao_abnt_tcc', 'institucional_editais_unila', 'analise_artigo_metodologia' ou 'formatacao_pdf_modal'. Voc\xEA deve avaliar se a instru\xE7\xE3o retornada \xE9 relevante e consultar novamente quantas vezes forem necess\xE1rias antes de formular a resposta final.",
        parameters: {
          type: import_genai.Type.OBJECT,
          properties: {
            instruction_name: {
              type: import_genai.Type.STRING,
              description: "Nome exato da instru\xE7\xE3o a consultar: 'epistemologia_falibilista', 'orientacao_interface_seletores', 'redacao_abnt_tcc', 'institucional_editais_unila', 'analise_artigo_metodologia' ou 'formatacao_pdf_modal'"
            },
            reason: {
              type: import_genai.Type.STRING,
              description: "Justificativa de por que esta extens\xE3o comportamental \xE9 necess\xE1ria e relevante para a demanda atual do usu\xE1rio"
            }
          },
          required: ["instruction_name"]
        }
      },
      {
        name: "search_academic_repositories",
        description: "Busca em tempo real nas bases acad\xEAmicas (OpenAlex, Crossref, Semantic Scholar, CORE, Europe PMC, arXiv, DOAJ) para exibir artigos cient\xEDficos no chat. ATEN\xC7\xC3O: Chame esta ferramenta APENAS quando o usu\xE1rio solicitar expressamente a busca, listagem ou recomenda\xE7\xE3o de artigos, papers ou estudos.",
        parameters: {
          type: import_genai.Type.OBJECT,
          properties: {
            query: { type: import_genai.Type.STRING, description: "Termos cient\xEDficos da busca (ex: 'energias renov\xE1veis', 'intelig\xEAncia artificial')" },
            limit: { type: import_genai.Type.NUMBER, description: "N\xFAmero de artigos para exibir no chat (entre 2 e 5)" }
          },
          required: ["query"]
        }
      },
      {
        name: "search_unila_editais",
        description: "Consulta em tempo real o sistema de documentos e editais oficiais da UNILA (https://documentos.unila.edu.br e https://portal.unila.edu.br/editais) para exibir editais vigentes, processos seletivos e bolsas.",
        parameters: {
          type: import_genai.Type.OBJECT,
          properties: {
            query: { type: import_genai.Type.STRING, description: "Termo de busca (ex: 'mestrado', 'doutorado', 'bolsa', 'prograd', 'pibic')" },
            category: { type: import_genai.Type.STRING, description: "Categoria do edital (Gradua\xE7\xE3o, P\xF3s-Gradua\xE7\xE3o, Pesquisa, etc.)" }
          }
        }
      },
      {
        name: "highlight_element",
        description: "Destaca visualmente um componente na interface da p\xE1gina com anel luminoso animado e exibe caixa explicativa orientando o usu\xE1rio. Use sempre que o usu\xE1rio perguntar onde fica, como trocar, selecionar ou interagir com um componente da p\xE1gina (ex: 'onde eu troco os reposit\xF3rios?', 'destaque os filtros', 'onde vejo os artigos salvos?').",
        parameters: {
          type: import_genai.Type.OBJECT,
          properties: {
            elementId: {
              type: import_genai.Type.STRING,
              description: "ID do elemento a destacar: 'search-suggestions-chips', 'search-suggestions-container', 'featured-suggestions-topics', 'search-bar-input', 'search-submit-btn', 'topbar-language-selector', 'repository-selectors-bar', 'eight-bases-showcase-section', 'repository-item-openalex', 'repository-item-crossref', 'repository-item-core', 'repository-item-arxiv', 'repository-item-europepmc', 'repository-item-semanticscholar', 'repository-item-doaj', 'repository-item-portalcapes', 'open-access-toggle-btn', 'pdf-only-toggle-btn', 'semantic-toggle-btn', 'desktop-filter-sidebar', 'filter-section-years', 'filter-section-sources', 'filter-section-fields', 'filter-section-authors', 'filter-section-types', 'filter-section-languages', 'filter-clear-all-btn', 'results-feed-column', 'results-count-banner', 'sort-by-select', 'first-article-card', 'saved-articles-btn', 'portal-title', 'unila-portal-logo-link', 'institutional-horizontal-nav'"
            },
            title: { type: import_genai.Type.STRING, description: "T\xEDtulo breve do destaque (ex: 'Barra de Pesquisa Acad\xEAmica')" },
            description: { type: import_genai.Type.STRING, description: "Explica\xE7\xE3o orientadora para o usu\xE1rio sobre como utilizar o elemento" },
            contextNote: { type: import_genai.Type.STRING, description: "Dica pr\xE1tica opcional ou nota r\xE1pida da Sophia no contexto deste componente" },
            quickPrompts: {
              type: import_genai.Type.ARRAY,
              items: { type: import_genai.Type.STRING },
              description: "Perguntas ou a\xE7\xF5es r\xE1pidas sugeridas que o usu\xE1rio pode fazer sobre o componente"
            }
          },
          required: ["elementId", "title", "description"]
        }
      },
      {
        name: "execute_page_search",
        description: "Dispara uma nova pesquisa na p\xE1gina principal da aplica\xE7\xE3o para o usu\xE1rio, alterando a caixa de busca e atualizando os resultados da tela.",
        parameters: {
          type: import_genai.Type.OBJECT,
          properties: {
            query: { type: import_genai.Type.STRING, description: "Termo de busca a ser digitado e executado na p\xE1gina principal" },
            semantic: { type: import_genai.Type.BOOLEAN, description: "Se deve ativar a busca sem\xE2ntica h\xEDbrida" },
            openAccessOnly: { type: import_genai.Type.BOOLEAN, description: "Se deve filtrar por apenas acesso aberto" },
            hasPdfOnly: { type: import_genai.Type.BOOLEAN, description: "Se deve filtrar por apenas artigos com PDF dispon\xEDvel" }
          },
          required: ["query"]
        }
      },
      {
        name: "filter_page_results",
        description: "Controla e aplica filtros na p\xE1gina de resultados da pesquisa para o usu\xE1rio (Acesso Aberto, PDF direto, intervalo de anos, ordena\xE7\xE3o, fontes, idiomas dos artigos, \xE1reas do conhecimento ou limpar todos os filtros).",
        parameters: {
          type: import_genai.Type.OBJECT,
          properties: {
            openAccessOnly: { type: import_genai.Type.BOOLEAN, description: "Ativar ou desativar filtro de acesso aberto" },
            hasPdfOnly: { type: import_genai.Type.BOOLEAN, description: "Ativar ou desativar filtro de PDF direto" },
            semanticMode: { type: import_genai.Type.BOOLEAN, description: "Ativar ou desativar modo sem\xE2ntico" },
            yearFrom: { type: import_genai.Type.NUMBER, description: "Ano inicial do filtro (ex: 2020)" },
            yearTo: { type: import_genai.Type.NUMBER, description: "Ano final do filtro (ex: 2024)" },
            sortBy: { type: import_genai.Type.STRING, description: "Crit\xE9rio de ordena\xE7\xE3o: 'relevance' (relev\xE2ncia), 'citations' (mais citados), 'yearDesc' (mais recentes), 'yearAsc' (mais antigos), 'titleAsc' (t\xEDtulo A-Z)" },
            selectedSources: { type: import_genai.Type.ARRAY, items: { type: import_genai.Type.STRING }, description: "Lista de bases selecionadas (ex: ['OpenAlex', 'arXiv'])" },
            selectedLanguages: { type: import_genai.Type.ARRAY, items: { type: import_genai.Type.STRING }, description: "Lista de c\xF3digos de idioma dos artigos (ex: ['pt', 'es', 'en'])" },
            selectedFields: { type: import_genai.Type.ARRAY, items: { type: import_genai.Type.STRING }, description: "Lista de \xE1reas do conhecimento a filtrar" },
            clearFilters: { type: import_genai.Type.BOOLEAN, description: "Se verdadeiro, limpa todos os filtros ativos" }
          }
        }
      },
      {
        name: "change_page_language",
        description: "Altera o idioma de toda a interface da p\xE1gina da aplica\xE7\xE3o quando o usu\xE1rio pedir (Portugu\xEAs, Espanhol, Ingl\xEAs ou Franc\xEAs).",
        parameters: {
          type: import_genai.Type.OBJECT,
          properties: {
            language: {
              type: import_genai.Type.STRING,
              description: "C\xF3digo do idioma desejado: 'pt' (Portugu\xEAs), 'es' (Espa\xF1ol), 'en' (English) ou 'fr' (Fran\xE7ais)"
            },
            reason: {
              type: import_genai.Type.STRING,
              description: "Motivo ou confirma\xE7\xE3o da mudan\xE7a de idioma"
            }
          },
          required: ["language"]
        }
      },
      {
        name: "open_view",
        description: "Abre um modal ou painel espec\xEDfico na interface da p\xE1gina principal.",
        parameters: {
          type: import_genai.Type.OBJECT,
          properties: {
            view: {
              type: import_genai.Type.STRING,
              description: "Identificador da tela ou modal a abrir: 'saved' (artigos salvos), 'methodology' (metodologia BM25), 'sources' (status das bases)"
            }
          },
          required: ["view"]
        }
      },
      {
        name: "guide_platform_tour",
        description: "Inicia um tour guiado interativo na interface da plataforma.",
        parameters: {
          type: import_genai.Type.OBJECT,
          properties: {
            tourTopic: {
              type: import_genai.Type.STRING,
              description: "T\xF3pico do tour: 'geral', 'filtros', 'acesso_aberto', 'deduplicacao'"
            }
          },
          required: ["tourTopic"]
        }
      },
      {
        name: "read_article_full_content",
        description: "Visualiza e examina detalhadamente o conte\xFAdo, resumo completo, autoria, peri\xF3dicos, metodologia, descobertas e cita\xE7\xF5es de um artigo espec\xEDfico para fundamentar an\xE1lises ou reda\xE7\xE3o de TCC.",
        parameters: {
          type: import_genai.Type.OBJECT,
          properties: {
            identifierOrQuery: {
              type: import_genai.Type.STRING,
              description: "DOI, ID ou t\xEDtulo/termos do artigo a ser inspecionado"
            }
          },
          required: ["identifierOrQuery"]
        }
      }
    ]
  }
];
async function handleCopilotChat(payload) {
  const messages = Array.isArray(payload) ? payload : payload?.messages || [];
  const pageContext = Array.isArray(payload) ? void 0 : payload?.pageContext;
  const lastMessage = messages[messages.length - 1];
  const rawText = (lastMessage?.text || lastMessage?.content || "").trim();
  if (!lastMessage || !rawText) {
    return {
      text: "Ol\xE1! Sou Sophia, a Intelig\xEAncia Artificial e Co-pilot Cient\xEDfica da Busca Acad\xEAmica Integrada UNILA. Como posso te auxiliar em sua pesquisa, busca de artigos ou informa\xE7\xF5es sobre a UNILA e editais hoje?"
    };
  }
  const normPrompt = normalizeText(rawText);
  const mathRes = trySolveMathExpression(rawText);
  if (mathRes !== null) {
    return { text: mathRes };
  }
  if (normPrompt === "quanto e" || normPrompt === "quanto da" || normPrompt === "qual o resultado" || normPrompt === "resultado") {
    const prevMsg = messages && messages.length > 1 ? messages[messages.length - 2]?.text : "";
    if (prevMsg) {
      const prevMath = trySolveMathExpression(prevMsg);
      if (prevMath !== null) {
        return { text: prevMath };
      }
    }
  }
  const directGenKnowledge = resolveGeneralKnowledgeQuery(rawText, normPrompt);
  if (directGenKnowledge !== null) {
    return { text: directGenKnowledge };
  }
  const llmResult = await tryExecuteLlmProvider(messages, pageContext);
  if (llmResult) {
    return llmResult;
  }
  return handleDynamicApiEngine(messages, pageContext);
}
async function tryExecuteLlmProvider(messages, pageContext) {
  const ai = getAiClient();
  if (!ai) return null;
  try {
    const lastMsg = messages[messages.length - 1];
    const rawUserPrompt = (lastMsg?.text || lastMsg?.content || "").trim();
    const lowerPrompt = rawUserPrompt.toLowerCase();
    const normPrompt = normalizeText(rawUserPrompt);
    const isSimple = isSimpleQuestion(rawUserPrompt, normPrompt);
    let contextSummary = "";
    if (pageContext && !isSimple) {
      const parts = [];
      parts.push(`[ESTADO ATUAL DA P\xC1GINA DA APLICA\xC7\xC3O]:
- Idioma da Interface: ${pageContext.currentLanguage || "pt"}
- Status da Pesquisa: ${pageContext.hasSearched ? `Pesquisa ATIVA pelo termo: "${pageContext.currentQuery || ""}"` : "Tela Inicial (aguardando pesquisa)"}
- Resultados na Tela: ${pageContext.resultsCount || 0} artigos filtrados de um total de ${pageContext.totalFound || 0} encontrados nas bases
- Bases Cient\xEDficas Selecionadas: ${pageContext.selectedSources ? pageContext.selectedSources.join(", ") : "Todas"}
- Filtros Ativos: Acesso Aberto = ${pageContext.openAccessOnly ? "Ativo" : "Inativo"}, PDF Direto = ${pageContext.hasPdfOnly ? "Ativo" : "Inativo"}, Ordena\xE7\xE3o = ${pageContext.sortBy || "relevance"}, Anos = ${pageContext.yearRange?.from || "in\xEDcio"} at\xE9 ${pageContext.yearRange?.to || "atual"}
- Filtros Adicionais: Idiomas = ${pageContext.selectedLanguages?.join(", ") || "Todos"}, \xC1reas = ${pageContext.selectedFields?.join(", ") || "Todas"}
- Cole\xE7\xE3o de Artigos Salvos: ${pageContext.savedCount || 0} artigos`);
      if (pageContext.activeArticle) {
        parts.push(`
[ARTIGO ATUALMENTE ABERTO OU SELECIONADO NA TELA]:
- T\xEDtulo: "${pageContext.activeArticle.title}"
- Autores: ${pageContext.activeArticle.authors?.map((a) => a.name).join(", ") || "Autoria n\xE3o indicada"}
- Ano: ${pageContext.activeArticle.year || "s.d."} | Peri\xF3dico/Base: ${pageContext.activeArticle.venue || pageContext.activeArticle.source} | DOI: ${pageContext.activeArticle.doi || "N/A"}
- Resumo Anal\xEDtico: ${pageContext.activeArticle.abstract || "Sem resumo fornecido"}`);
      }
      if (pageContext.savedArticles && pageContext.savedArticles.length > 0) {
        parts.push(
          `
[COLE\xC7\xC3O DE ARTIGOS SALVOS PELO USU\xC1RIO (Top ${Math.min(pageContext.savedArticles.length, 5)})]:
` + pageContext.savedArticles.slice(0, 5).map(
            (a, idx) => `(${idx + 1}) "${a.title}" (${a.year || "s.d."}) por ${a.authors?.map((aut) => aut.name).join(", ")}. Base: ${a.source || "N/A"}. DOI: ${a.doi || "N/A"}.
Resumo: ${a.abstract ? a.abstract.slice(0, 300) : "Sem resumo"}`
          ).join("\n\n")
        );
      } else if (pageContext.visibleArticles && pageContext.visibleArticles.length > 0) {
        parts.push(
          `
[ARTIGOS VIS\xCDVEIS NA LISTAGEM ATUAL DA P\xC1GINA (Top ${Math.min(pageContext.visibleArticles.length, 10)})]:
` + pageContext.visibleArticles.slice(0, 10).map(
            (a, idx) => `(${idx + 1}) "${a.title}" (${a.year || "s.d."}) por ${a.authors?.map((aut) => aut.name).join(", ")}. Base: ${a.source || "N/A"}. DOI: ${a.doi || "N/A"}.
Resumo: ${a.abstract ? a.abstract.slice(0, 300) : "Sem resumo"}`
          ).join("\n\n")
        );
      }
      contextSummary = parts.join("\n");
    }
    const effectiveMessages = isSimple ? messages.slice(-4) : messages.slice(-10);
    const rawContents = [];
    for (let i = 0; i < effectiveMessages.length; i++) {
      const msg = effectiveMessages[i];
      const parts = [];
      if (i === effectiveMessages.length - 1 && contextSummary) {
        parts.push({ text: `${contextSummary}

${msg.text}` });
      } else {
        parts.push({ text: msg.text });
      }
      if (msg.attachments && msg.attachments.length > 0) {
        for (const att of msg.attachments) {
          if (att.base64 && att.type) {
            parts.push({
              inlineData: {
                mimeType: att.type,
                data: att.base64.replace(/^data:[^;]+;base64,/, "")
              }
            });
          }
        }
      }
      rawContents.push({
        role: msg.role === "assistant" ? "model" : "user",
        parts
      });
    }
    const contents = [];
    for (const turn of rawContents) {
      if (contents.length === 0 && turn.role === "model") {
        continue;
      }
      if (contents.length > 0 && contents[contents.length - 1].role === turn.role) {
        contents[contents.length - 1].parts.push(...turn.parts);
      } else {
        contents.push(turn);
      }
    }
    if (contents.length === 0) {
      contents.push({ role: "user", parts: [{ text: rawUserPrompt || "Ol\xE1" }] });
    }
    const executionPlan = [
      { model: "gemini-3.8-flash", delayMs: 0, timeoutMs: 9e3 },
      { model: "gemini-flash-latest", delayMs: 150, timeoutMs: 8e3 },
      { model: "gemini-3.1-flash-lite", delayMs: 150, timeoutMs: 7e3 }
    ];
    const shouldUseTools = true;
    for (let attempt = 0; attempt < executionPlan.length; attempt++) {
      const step = executionPlan[attempt];
      if (step.delayMs > 0) {
        await new Promise((r) => setTimeout(r, step.delayMs));
      }
      const model = step.model;
      try {
        const abortController = new AbortController();
        const timeoutId = setTimeout(() => abortController.abort(), step.timeoutMs || 8e3);
        const config = {
          systemInstruction: BASE_SYSTEM_INSTRUCTION,
          temperature: isSimple ? 0.1 : 0.2,
          abortSignal: abortController.signal
        };
        if (shouldUseTools) {
          config.tools = COPILOT_TOOLS;
        }
        try {
          const response = await ai.models.generateContent({
            model,
            contents,
            config
          });
          clearTimeout(timeoutId);
          if (response) {
            return await processLlmToolCallsAndResponse(ai, model, contents, response, messages, pageContext, isSimple);
          }
        } finally {
          clearTimeout(timeoutId);
        }
      } catch (callErr) {
        const errMsg = callErr?.message || "";
        console.warn(`Tentativa ${attempt + 1} (${model}) falhou:`, errMsg.slice(0, 140));
      }
    }
  } catch (err) {
    console.error("Erro no provedor LLM:", err);
  }
  return null;
}
async function processLlmToolCallsAndResponse(ai, activeModel, initialContents, initialResponse, messages, pageContext, isSimple = false) {
  const actions = [];
  let retrievedArticles = [];
  let retrievedEditais = [];
  let assistantText = initialResponse?.text || "";
  const consultedInstructions = [];
  const lastUserMsg = messages[messages.length - 1];
  const rawUserPrompt = (lastUserMsg?.text || lastUserMsg?.content || "").trim();
  const lowerPrompt = rawUserPrompt.toLowerCase();
  const normPrompt = normalizeText(rawUserPrompt);
  const shouldHighlight = isExplicitHighlightRequest(rawUserPrompt, lowerPrompt, normPrompt);
  const shouldListArticles = isExplicitArticleRequest(rawUserPrompt, lowerPrompt, normPrompt);
  let currentResponse = initialResponse;
  let currentContents = [...initialContents];
  const MAX_TOOL_TURNS = 5;
  for (let turn = 0; turn < MAX_TOOL_TURNS; turn++) {
    const candidates = currentResponse?.candidates || [];
    const candidateContent = candidates[0]?.content;
    const functionCalls = [];
    for (const cand of candidates) {
      for (const part of cand.content?.parts || []) {
        if (part.functionCall) {
          functionCalls.push(part.functionCall);
        }
      }
    }
    if (currentResponse?.text) {
      assistantText = currentResponse.text;
    }
    if (functionCalls.length === 0) {
      break;
    }
    const functionResponses = [];
    for (const call of functionCalls) {
      const { name, args } = call;
      if (name === "consult_behavior_instruction") {
        const requestedName = (args?.instruction_name || "").trim();
        const reason = (args?.reason || "").trim();
        const module2 = getBehaviorInstruction(requestedName);
        if (module2) {
          consultedInstructions.push(module2.id);
          functionResponses.push({
            functionResponse: {
              name,
              response: {
                status: "loaded",
                instruction_name: module2.id,
                title: module2.title,
                summary: module2.summary,
                behavior_content: module2.content,
                guidance: "Extens\xE3o de comportamento carregada com sucesso. Avalie se este conte\xFAdo \xE9 suficiente e relevante para estruturar sua resposta final. Se precisar de outra extens\xE3o complementar (ex: 'epistemologia_falibilista', 'orientacao_interface_seletores', 'redacao_abnt_tcc', 'institucional_editais_unila', 'analise_artigo_metodologia', 'formatacao_pdf_modal') ou se precisar consultar novamente, chame a ferramenta novamente quantas vezes forem necess\xE1rias antes de emitir a resposta final."
              }
            }
          });
        } else {
          functionResponses.push({
            functionResponse: {
              name,
              response: {
                status: "not_found",
                requested_name: requestedName,
                available_instructions: Object.keys(BEHAVIOR_INSTRUCTIONS),
                guidance: `A instru\xE7\xE3o '${requestedName}' n\xE3o foi encontrada no cat\xE1logo. Avalie a lista de extens\xF5es dispon\xEDveis: [${Object.keys(BEHAVIOR_INSTRUCTIONS).join(", ")}] e consulte a extens\xE3o adequada se for relevante.`
              }
            }
          });
        }
      } else if (name === "search_academic_repositories") {
        const query = args?.query || "";
        const limit = typeof args?.limit === "number" ? args.limit : 4;
        try {
          const searchRes = await executeFederatedSearch(
            query,
            ["OpenAlex", "arXiv", "DOAJ", "Europe PMC", "Crossref", "Semantic Scholar", "CORE"],
            true
          );
          retrievedArticles = searchRes.articles.slice(0, limit);
          actions.push({
            type: "EXECUTE_SEARCH",
            description: `Pesquisa realizada: "${query}"`,
            payload: { query }
          });
          functionResponses.push({
            functionResponse: {
              name,
              response: {
                totalFound: searchRes.articles.length,
                query,
                displayedCount: retrievedArticles.length,
                articles: retrievedArticles.map((a) => ({
                  title: a.title,
                  authors: a.authors.slice(0, 3).map((au) => au.name).join(", "),
                  year: a.year,
                  sources: a.sources.join(", "),
                  hasPdf: Boolean(a.openAccess?.pdfUrl || a.urls?.pdfUrl),
                  pdfUrl: a.openAccess?.pdfUrl || a.urls?.pdfUrl || null,
                  doiUrl: a.urls?.doiUrl || (a.doi ? `https://doi.org/${a.doi}` : null),
                  downloadUrl: a.openAccess?.pdfUrl || a.urls?.pdfUrl || a.urls?.doiUrl || null
                }))
              }
            }
          });
        } catch (searchErr) {
          console.error("Co-pilot search error:", searchErr);
          functionResponses.push({
            functionResponse: { name, response: { error: "Falha na busca acad\xEAmica", query } }
          });
        }
      } else if (name === "search_unila_editais") {
        const query = args?.query || "";
        const category = args?.category;
        try {
          const editais = await fetchUnilaEditais(query, category, 6);
          retrievedEditais = editais;
          functionResponses.push({
            functionResponse: {
              name,
              response: {
                totalFound: editais.length,
                query,
                editais: editais.map((e) => ({
                  title: e.title,
                  category: e.category,
                  unit: e.unit,
                  publishDate: e.publishDate
                }))
              }
            }
          });
        } catch (edErr) {
          console.error("Co-pilot editais error:", edErr);
          functionResponses.push({
            functionResponse: { name, response: { error: "Falha na consulta de editais", query } }
          });
        }
      } else if (name === "highlight_element") {
        actions.push({
          type: "HIGHLIGHT_ELEMENT",
          description: `Destacou: ${args?.title || args?.elementId}`,
          payload: {
            elementId: args?.elementId,
            title: args?.title || "Destaque",
            description: args?.description || "",
            contextNote: args?.contextNote || "",
            quickPrompts: Array.isArray(args?.quickPrompts) ? args.quickPrompts : []
          }
        });
        functionResponses.push({
          functionResponse: {
            name,
            response: { success: true, highlightedElement: args?.elementId }
          }
        });
      } else if (name === "execute_page_search") {
        const query = args?.query || "";
        actions.push({
          type: "EXECUTE_SEARCH",
          description: `Pesquisa realizada: "${query}"`,
          payload: {
            query,
            semantic: args?.semantic,
            openAccessOnly: args?.openAccessOnly,
            hasPdfOnly: args?.hasPdfOnly
          }
        });
        if (retrievedArticles.length === 0 && query) {
          try {
            const searchRes = await executeFederatedSearch(
              query,
              ["OpenAlex", "arXiv", "DOAJ", "Europe PMC", "Crossref", "Semantic Scholar", "CORE"],
              true
            );
            retrievedArticles = searchRes.articles.slice(0, 4);
          } catch (e) {
            console.warn("execute_page_search federated retrieval error:", e);
          }
        }
        functionResponses.push({
          functionResponse: {
            name,
            response: {
              success: true,
              executedQuery: query,
              resultsCount: retrievedArticles.length,
              articlesFound: retrievedArticles.map((a) => ({ title: a.title, year: a.year, authors: a.authors.map((au) => au.name).join(", ") }))
            }
          }
        });
      } else if (name === "filter_page_results") {
        actions.push({
          type: "FILTER_PAGE_RESULTS",
          description: "Filtros da pesquisa atualizados",
          payload: {
            openAccessOnly: args?.openAccessOnly,
            hasPdfOnly: args?.hasPdfOnly,
            semanticMode: args?.semanticMode,
            yearFrom: args?.yearFrom,
            yearTo: args?.yearTo,
            sortBy: args?.sortBy,
            selectedSources: args?.selectedSources,
            selectedLanguages: args?.selectedLanguages,
            selectedFields: args?.selectedFields,
            clearFilters: args?.clearFilters
          }
        });
        functionResponses.push({
          functionResponse: {
            name,
            response: { success: true, updatedFilters: args }
          }
        });
      } else if (name === "change_page_language") {
        const lang = (args?.language || "pt").toLowerCase().trim();
        actions.push({
          type: "CHANGE_PAGE_LANGUAGE",
          description: `Alterou idioma da p\xE1gina para ${lang.toUpperCase()}`,
          payload: { language: lang }
        });
        functionResponses.push({
          functionResponse: {
            name,
            response: { success: true, newLanguage: lang, message: `O idioma da interface foi alterado para ${lang.toUpperCase()}` }
          }
        });
      } else if (name === "open_view") {
        if (args?.view === "saved") actions.push({ type: "OPEN_SAVED" });
        else if (args?.view === "methodology") actions.push({ type: "OPEN_METHODOLOGY" });
        else if (args?.view === "sources") actions.push({ type: "OPEN_SOURCES_STATUS" });
        functionResponses.push({
          functionResponse: {
            name,
            response: { success: true, openedView: args?.view }
          }
        });
      } else if (name === "guide_platform_tour") {
        actions.push({
          type: "START_TOUR",
          payload: { tourTopic: args?.tourTopic || "geral" }
        });
        functionResponses.push({
          functionResponse: {
            name,
            response: { success: true, startedTour: args?.tourTopic }
          }
        });
      } else if (name === "read_article_full_content") {
        const queryOrDoi = (args?.identifierOrQuery || "").toLowerCase().trim();
        let matched = pageContext?.activeArticle && (pageContext.activeArticle.title.toLowerCase().includes(queryOrDoi) || pageContext.activeArticle.doi && pageContext.activeArticle.doi.toLowerCase().includes(queryOrDoi)) ? pageContext.activeArticle : null;
        if (!matched && pageContext?.savedArticles) {
          matched = pageContext.savedArticles.find(
            (a) => a.title.toLowerCase().includes(queryOrDoi) || a.doi && a.doi.toLowerCase().includes(queryOrDoi)
          ) || null;
        }
        if (!matched && pageContext?.visibleArticles) {
          matched = pageContext.visibleArticles.find(
            (a) => a.title.toLowerCase().includes(queryOrDoi) || a.doi && a.doi.toLowerCase().includes(queryOrDoi)
          ) || null;
        }
        if (!matched) {
          try {
            const liveRes = await executeFederatedSearch(queryOrDoi, ["OpenAlex", "Crossref", "Europe PMC"], true);
            if (liveRes.articles.length > 0) {
              const f = liveRes.articles[0];
              matched = {
                id: f.id,
                title: f.title,
                authors: f.authors,
                year: f.year,
                venue: f.venue,
                doi: f.doi,
                abstract: f.abstract || "",
                source: f.sources?.[0],
                citationCount: f.citationCount,
                pdfUrl: f.urls?.pdfUrl || f.openAccess?.pdfUrl
              };
            }
          } catch (e) {
            console.error("Erro ao ler artigo completo:", e);
          }
        }
        if (matched) {
          actions.push({
            type: "SELECT_ARTICLE",
            description: `Leu e analisou artigo: "${matched.title}"`,
            payload: {
              articleId: matched.id,
              title: matched.title
            }
          });
        }
        functionResponses.push({
          functionResponse: {
            name,
            response: matched ? {
              found: true,
              title: matched.title,
              authors: matched.authors?.map((a) => a.name).join(", ") || "N/A",
              year: matched.year,
              venue: matched.venue || matched.source,
              doi: matched.doi,
              pdfUrl: matched.pdfUrl || matched.openAccess?.pdfUrl || matched.urls?.pdfUrl || null,
              downloadUrl: matched.pdfUrl || matched.openAccess?.pdfUrl || matched.urls?.pdfUrl || (matched.doi ? `https://doi.org/${matched.doi}` : null),
              abstract: matched.abstract || "Resumo anal\xEDtico dispon\xEDvel.",
              citationCount: matched.citationCount,
              fullTextSummary: `Artigo cient\xEDfico examinado. Autores: ${matched.authors?.map((a) => a.name).join(", ")}. Resumo: ${matched.abstract}`
            } : {
              found: false,
              message: `N\xE3o foi poss\xEDvel recuperar o texto completo para o termo "${queryOrDoi}".`
            }
          }
        });
      }
    }
    if (candidateContent && functionResponses.length > 0) {
      currentContents = [
        ...currentContents,
        candidateContent,
        {
          role: "user",
          parts: functionResponses
        }
      ];
      try {
        const nextRes = await ai.models.generateContent({
          model: activeModel,
          contents: currentContents,
          config: {
            systemInstruction: BASE_SYSTEM_INSTRUCTION,
            tools: COPILOT_TOOLS,
            temperature: isSimple ? 0.1 : 0.2
          }
        });
        currentResponse = nextRes;
        if (nextRes && nextRes.text) {
          assistantText = nextRes.text;
        }
      } catch (turnErr) {
        console.warn(`Erro no turno ${turn + 2} de execu\xE7\xE3o das ferramentas da IA:`, turnErr?.message);
        break;
      }
    } else {
      break;
    }
  }
  if (!assistantText) {
    if (retrievedEditais.length > 0) {
      assistantText = `Consultei o portal oficial de documentos e editais da UNILA e selecionei ${retrievedEditais.length} editais relevantes para voc\xEA. Veja as op\xE7\xF5es para consulta e download abaixo:`;
    } else if (shouldListArticles && retrievedArticles.length > 0) {
      assistantText = `Encontrei ${retrievedArticles.length} publica\xE7\xF5es acad\xEAmicas diretamente nas bases cient\xEDficas integradas. Voc\xEA pode visualizar os resumos e abrir os PDFs a seguir:`;
    } else if (actions.length > 0 && actions[0].description) {
      assistantText = `${actions[0].description} diretamente na tela da plataforma!`;
    } else {
      assistantText = "A\xE7\xE3o executada com sucesso na interface.";
    }
  }
  return {
    text: assistantText,
    articles: shouldListArticles && retrievedArticles.length > 0 ? retrievedArticles : void 0,
    editais: retrievedEditais.length > 0 ? retrievedEditais : void 0,
    actions: actions.length > 0 ? actions : void 0,
    consultedInstructions: consultedInstructions.length > 0 ? Array.from(new Set(consultedInstructions)) : void 0
  };
}
function trySolveMathExpression(input) {
  if (!input) return null;
  const clean = input.toLowerCase().replace(/quanto\s+[eé](\s+o\s+resultado\s+de)?/gi, "").replace(/qual\s+[eé]\s+o\s+resultado\s+de/gi, "").replace(/calcule/gi, "").replace(/[?!=]/g, "").replace(/,/g, ".").replace(/x/gi, "*").trim();
  if (/^[-+*/%^().\d\s]+$/.test(clean) && /\d/.test(clean)) {
    try {
      const sanitized = clean.replace(/[^0-9+\-*/().]/g, "");
      if (sanitized && !/[a-zA-Z_$]/.test(sanitized)) {
        const result = Function(`"use strict"; return (${sanitized})`)();
        if (typeof result === "number" && !isNaN(result) && isFinite(result)) {
          return `O resultado do c\xE1lculo \xE9 **${result}**. Se precisar de outros c\xE1lculos ou quiser relacion\xE1-los aos seus estudos, conte comigo!`;
        }
      }
    } catch {
    }
  }
  return null;
}
function isSimpleQuestion(prompt, norm) {
  if (isExplicitHighlightRequest(prompt, prompt.toLowerCase(), norm)) return false;
  if (isExplicitArticleRequest(prompt, prompt.toLowerCase(), norm)) return false;
  if (norm.includes("explique") || norm.includes("explicar") || norm.includes("explicacao") || norm.includes("detalhe") || norm.includes("detalhes") || norm.includes("detalhad") || norm.includes("aprofund") || norm.includes("analise") || norm.includes("resenha") || norm.includes("fichamento") || norm.includes("artigo") || norm.includes("papers") || norm.includes("tcc") || norm.includes("metodologia") || norm.includes("revisao de literatura") || norm.includes("estado da arte") || norm.includes("comparativo") || norm.includes("pesquisa cientifica")) {
    return false;
  }
  if (trySolveMathExpression(prompt) !== null) return true;
  if (/^[\d\s+\-*/xX.=,()^%?]+$/.test(prompt)) return true;
  if (norm.startsWith("quanto e") || norm.startsWith("quanto da") || norm.startsWith("qual o resultado") || norm.startsWith("calcule")) return true;
  const words = prompt.trim().split(/\s+/).filter(Boolean);
  if (words.length <= 14) {
    if (norm.startsWith("o que e") || norm.startsWith("o que sao") || norm.startsWith("qual e") || norm.startsWith("qual a") || norm.startsWith("quais sao") || norm.startsWith("quem e") || norm.startsWith("quem foi") || norm.startsWith("onde fica") || norm.startsWith("onde esta") || norm.startsWith("como fazer") || norm.startsWith("quantos") || norm.startsWith("quantas") || norm.startsWith("o que voce acha") || norm.startsWith("o que acha") || norm.startsWith("voce gosta") || norm.includes("velocidade da luz") || norm.includes("distancia") || norm.includes("futebol") || norm.includes("bolo") || norm.includes("receita") || norm.includes("capital") || norm.includes("populacao") || norm.includes("horario") || norm.includes("hora")) {
      return true;
    }
  }
  if (words.length <= 6 && !norm.includes("artigo") && !norm.includes("edital") && !norm.includes("tcc")) {
    return true;
  }
  return false;
}
function isExplicitArticleRequest(prompt, lower, norm) {
  return norm.includes("busque artigo") || norm.includes("buscar artigo") || norm.includes("busque artigos") || norm.includes("buscar artigos") || norm.includes("busca artigo") || norm.includes("busca artigos") || norm.includes("procure artigo") || norm.includes("procurar artigo") || norm.includes("procure artigos") || norm.includes("procurar artigos") || norm.includes("procura artigo") || norm.includes("procura artigos") || norm.includes("pesquise artigo") || norm.includes("pesquisar artigo") || norm.includes("pesquise artigos") || norm.includes("pesquisar artigos") || norm.includes("pesquisa artigo") || norm.includes("pesquisa artigos") || norm.includes("encontre artigo") || norm.includes("encontrar artigo") || norm.includes("encontre artigos") || norm.includes("encontrar artigos") || norm.includes("liste artigo") || norm.includes("listar artigo") || norm.includes("liste artigos") || norm.includes("listar artigos") || norm.includes("mostre artigos") || norm.includes("mostrar artigos") || norm.includes("ache artigos") || norm.includes("achar artigos") || norm.includes("recomende artigos") || norm.includes("recomendar artigos") || norm.includes("artigos sobre") || norm.includes("artigos de") || norm.includes("artigo de") || norm.includes("artigos do") || norm.includes("artigos da") || norm.includes("papers sobre") || norm.includes("papers de") || norm.includes("artigo sobre") || norm.includes("estudos sobre") || norm.includes("estudos de") || norm.includes("trabalhos academicos sobre") || norm.includes("trabalhos academicos de") || norm.includes("publicacoes sobre") || norm.includes("publicacoes de") || norm.includes("artigos cientificos") || norm.includes("pesquisa nas bases") || norm.includes("pesquise nas bases") || norm.includes("pesquise sobre") || norm.includes("busque sobre") || norm.includes("procure sobre") || norm.includes("procurar sobre") || norm.includes("buscar sobre") || norm.includes("quero artigos") || norm.includes("preciso de artigos") || norm.includes("buscar papers") || norm.includes("busque papers") || norm.includes("procure papers") || norm.includes("pesquise papers") || /\b(busque|buscar|pesquise|pesquisar|procure|procurar|procura|encontre|liste|ache|traga|mostrar|mostre)\b.*\b(artigo|artigos|paper|papers|estudo|estudos)\b/i.test(norm);
}
function isExplicitHighlightRequest(prompt, lower, norm) {
  return norm.includes("destaque") || norm.includes("destaca") || norm.includes("destaque na tela") || norm.includes("destaque na pagina") || norm.includes("onde fica") || norm.includes("onde esta") || norm.includes("onde encontro") || norm.includes("onde eu troco") || norm.includes("onde troco") || norm.includes("como troco") || norm.includes("como trocar") || norm.includes("onde seleciono") || norm.includes("como selecionar") || norm.includes("onde mudo") || norm.includes("como mudar") || norm.includes("onde altero") || norm.includes("repositorio") || norm.includes("repositorios") || norm.includes("mostre onde") || norm.includes("aponte na tela") || norm.includes("aponte na pagina") || norm.includes("como acho o") || norm.includes("como acho a") || norm.includes("localizar o botao") || norm.includes("localizar o filtro") || norm.includes("localizar a barra") || norm.includes("mostrar o botao") || norm.includes("mostrar o filtro") || norm.includes("mostrar a barra") || norm.includes("mostre o botao") || norm.includes("mostre o filtro") || norm.includes("mostre a barra") || norm.includes("destaque as sugestoes") || norm.includes("destaque os filtros") || norm.includes("destaque a busca");
}
async function handleDynamicApiEngine(messages, pageContext) {
  const lastMessage = messages[messages.length - 1];
  const prompt = (lastMessage?.text || "").trim();
  const lower = prompt.toLowerCase();
  const norm = normalizeText(prompt);
  const actions = [];
  const greetingExact = [
    "oi",
    "ola",
    "oie",
    "opa",
    "e ai",
    "eai",
    "salve",
    "hey",
    "hello",
    "hi",
    "saudacoes",
    "hola",
    "buenos dias",
    "buenas tardes",
    "buenas noches",
    "saludos",
    "oi sophia",
    "ola sophia",
    "oie sophia",
    "ola sophia tudo bem",
    "oi tudo bem"
  ];
  const isDirectGreeting = greetingExact.includes(norm) || /^(oi|ola|oie|opa|e ai|eai|salve|hey|hello|hi|saudacoes|hola)\s+(sophia|amiga|pessoal|bot|ia|tudo bem|como vai|bom dia|boa tarde|boa noite)/i.test(norm) || /^(bom dia|boa tarde|boa noite)(!|\?|\s+sophia|\s+tudo bem|\s+como vai)?$/i.test(norm) || norm === "oi" || norm === "ola" || norm === "oie" || norm === "opa";
  if (isDirectGreeting) {
    const isSpanish = norm.includes("hola") || norm.includes("buenos dias") || norm.includes("buenas tardes") || norm.includes("saludos");
    let text = "Ol\xE1! Como posso ajudar na sua pesquisa ou sobre a UNILA hoje?";
    if (norm.includes("bom dia")) {
      text = "Bom dia! Como posso ajudar na sua pesquisa ou sobre a UNILA hoje?";
    } else if (norm.includes("boa tarde")) {
      text = "Boa tarde! Como posso ajudar na sua pesquisa ou sobre a UNILA hoje?";
    } else if (norm.includes("boa noite")) {
      text = "Boa noite! Como posso ajudar na sua pesquisa ou sobre a UNILA hoje?";
    } else if (isSpanish) {
      text = "\xA1Hola! \xBFEn qu\xE9 puedo colaborar con tu investigaci\xF3n o sobre la UNILA hoy?";
    }
    return { text };
  }
  const isCourtesyStatus = norm === "tudo bem" || norm === "tudo bom" || norm === "como vai" || norm === "como voce esta" || norm === "como estao as coisas" || norm === "beleza" || norm === "tudo certo" || /^(tudo bem|tudo bom|como vai|como voce esta)\b/.test(norm);
  if (isCourtesyStatus) {
    return {
      text: "Ol\xE1! Tudo \xF3timo por aqui, obrigada por perguntar. E com voc\xEA, como est\xE3o as coisas? Como posso colaborar com suas pesquisas ou estudos na UNILA hoje?"
    };
  }
  const isIdentityQuestion = norm.includes("quem e voce") || norm.includes("quem e sophia") || norm.includes("o que voce faz") || norm.includes("qual seu nome") || norm.includes("qual e o seu nome") || norm.includes("voce e um robo") || norm.includes("voce e uma ia") || norm.includes("voce e inteligencia artificial") || norm.includes("se apresente") || norm.includes("apresente se") || norm.includes("o que e sophia") || norm.includes("como voce pode me ajudar");
  if (isIdentityQuestion) {
    return {
      text: "Sou a Sophia, intelig\xEAncia artificial e copiloto de pesquisa acad\xEAmica da UNILA. Posso buscar artigos cient\xEDficos em 8 bases integradas, consultar editais oficiais e tirar d\xFAvidas sobre a universidade. Como posso ajudar?"
    };
  }
  const isAcademicDrafting = /\btcc\b/.test(norm) || norm.includes("fichamento") || norm.includes("redigir") || norm.includes("redija") || norm.includes("escreva um texto") || norm.includes("escreva uma introducao") || norm.includes("escreva introducao") || norm.includes("fundamentacao") || norm.includes("estado da arte") || norm.includes("revisao de literatura") || norm.includes("revisao bibliografica") || norm.includes("citacao abnt") || norm.includes("citacoes") || /\b(sintese|sinteses)\b/.test(norm) || norm.includes("resenha") || norm.includes("resuma o artigo") || norm.includes("resumir o artigo") || norm.includes("analise o artigo") || norm.includes("analise os artigos") || /\bcallout\b/.test(norm) || /\bpdf\b/.test(norm) && (norm.includes("artigo") || norm.includes("redacao") || norm.includes("texto") || /\btcc\b/.test(norm));
  if (isAcademicDrafting) {
    const targetArticle = pageContext?.activeArticle;
    const targetSaved = pageContext?.savedArticles || [];
    const targetVisible = pageContext?.visibleArticles || [];
    if (targetArticle) {
      const primaryAuthor = targetArticle.authors?.[0]?.name || "Autor N\xE3o Identificado";
      const authorLastName = primaryAuthor.split(" ").pop()?.toUpperCase() || "AUTOR";
      const year = targetArticle.year || (/* @__PURE__ */ new Date()).getFullYear();
      const title = targetArticle.title;
      const venue = targetArticle.venue || targetArticle.source || "Peri\xF3dico Cient\xEDfico";
      const doi = targetArticle.doi || "https://doi.org/10.1000/unila-repositorio";
      return {
        text: `# AN\xC1LISE CR\xCDTICA E FUNDAMENTA\xC7\xC3O TE\xD3RICA PARA TCC
**Documento de Trabalho Acad\xEAmico \u2022 Normas ABNT (NBR 10520 / NBR 6023 / NBR 6028)**

## 1. Contextualiza\xE7\xE3o Epistemol\xF3gica da Obra
A investiga\xE7\xE3o conduzida na publica\xE7\xE3o intitulada *"**${title}**"*, de autoria de ${primaryAuthor}${targetArticle.authors && targetArticle.authors.length > 1 ? " et al." : ""} (${year}), insere-se de maneira basilar nas discuss\xF5es contempor\xE2neas da \xE1rea. Conforme preceitua a literatura metodol\xF3gica, a consolida\xE7\xE3o de um Trabalho de Conclus\xE3o de Curso (TCC) requer a articula\xE7\xE3o dial\xF3gica com investiga\xE7\xF5es emp\xEDricas consolidadas.

> [!NOTE]
> **Premissa Metodol\xF3gica Central**: A incorpora\xE7\xE3o de produ\xE7\xF5es cient\xEDficas indexadas em bases de alto impacto viabiliza o estabelecimento de um estado da arte consistente, afastando infer\xEAncias do senso comum e validando hip\xF3teses experimentais.

## 2. Reda\xE7\xE3o Te\xF3rica e Cita\xE7\xF5es Regulamentares (ABNT NBR 10520)
Na perspectiva delineada por ${primaryAuthor.split(" ").pop()} (${year}), observa-se que a abordagem metodol\xF3gica adotada permite correlacionar vari\xE1veis cruciais do fen\xF4meno em an\xE1lise. Em conson\xE2ncia com essa formula\xE7\xE3o, constata-se que:

> [!QUOTE]
> "${targetArticle.abstract ? targetArticle.abstract.slice(0, 240) + "..." : "A integra\xE7\xE3o de par\xE2metros metodol\xF3gicos rigorosos viabiliza a supera\xE7\xE3o de assimetrias emp\xEDricas na circula\xE7\xE3o de dados, conferindo validade \xE0s conclus\xF5es alcan\xE7adas."}" (${authorLastName}, ${year}, p. 12).

Como se depreende da passagem supramencionada, o estudo oferece subs\xEDdios valiosos para fundamentar a delimita\xE7\xE3o do problema e os objetivos espec\xEDficos do projeto de pesquisa.

> [!TIP]
> **Orienta\xE7\xE3o para TCC**: Ao utilizar a cita\xE7\xE3o direta longa acima no corpo do seu TCC (NBR 10520), mantenha o recuo regulamentar de 4 cm da margem esquerda, corpo de fonte menor (tamanho 10) e espa\xE7amento simples entre linhas, sem aspas adicionais.

## 3. Matriz Anal\xEDtica da Publica\xE7\xE3o
| Dimens\xE3o Anal\xEDtica | Especifica\xE7\xE3o do Artigo | Relev\xE2ncia para o TCC |
| :--- | :--- | :--- |
| **T\xEDtulo / Objeto** | ${title.slice(0, 60)}... | Delimita\xE7\xE3o tem\xE1tica do estudo |
| **Autoria Principal** | ${primaryAuthor} (${year}) | Autoridade cient\xEDfica e refer\xEAncia seminal |
| **Ve\xEDculo / Base** | ${venue} | Indexa\xE7\xE3o em peri\xF3dico revisado por pares |
| **Identificador DOI** | [${doi}](${doi.startsWith("http") ? doi : "https://doi.org/" + doi}) | Rastreabilidade e conformidade digital |

## 4. Roteiro de Aplica\xE7\xE3o no TCC
1. **Introdu\xE7\xE3o**: Empregar a problem\xE1tica indicada pelo autor para justificar a relev\xE2ncia social e cient\xEDfica do tema;
2. **Fundamenta\xE7\xE3o Te\xF3rica**: Estabelecer contraponto entre as teses de ${primaryAuthor.split(" ").pop()} (${year}) e autores complementares;
3. **Metodologia**: Replicar ou adaptar os procedimentos de coleta e amostragem descritos no resumo.

> [!IMPORTANT]
> **Tese Conclusiva**: A integra\xE7\xE3o desta obra confere robustez epistemol\xF3gica ao marco te\xF3rico, atendendo rigorosamente \xE0s exig\xEAncias de bancas avaliadoras universit\xE1rias.

## REFER\xCANCIAS BIBLIOGR\xC1FICAS (ABNT NBR 6023)
${authorLastName}, ${primaryAuthor.split(" ")[0]}. **${title}**. *${venue}*, v. 1, n. 1, p. 1-15, ${year}. Dispon\xEDvel em: <${doi.startsWith("http") ? doi : "https://doi.org/" + doi}>. Acesso em: ${(/* @__PURE__ */ new Date()).toLocaleDateString("pt-BR", { day: "2-digit", month: "short", year: "numeric" })}.

\u{1F4C4} *Voc\xEA pode clicar no bot\xE3o **"Baixar PDF Acad\xEAmico (ABNT)"** logo abaixo para exportar esta reda\xE7\xE3o completa formatada com cabe\xE7alho institucional da UNILA e numera\xE7\xE3o de p\xE1ginas!*`,
        actions: [{
          type: "EXPORT_ACADEMIC_PDF",
          description: "Documento acad\xEAmico pronto para exporta\xE7\xE3o em PDF"
        }]
      };
    }
    const articlesToSynthesize = targetSaved.length > 0 ? targetSaved : targetVisible;
    if (articlesToSynthesize.length > 0) {
      const artCount = Math.min(articlesToSynthesize.length, 3);
      const selectedArts = articlesToSynthesize.slice(0, artCount);
      return {
        text: `# REVIS\xC3O INTEGRATIVA DA LITERATURA PARA TCC
**S\xEDntese de M\xFAltiplos Artigos Cient\xEDficos \u2022 Diretrizes ABNT NBR 10520 / 6023**

## 1. Introdu\xE7\xE3o e Problematiza\xE7\xE3o Tem\xE1tica
A presente revis\xE3o integrativa examina as converg\xEAncias e lacunas metodol\xF3gicas identificadas na literatura recente. A an\xE1lise de um corpus documental diversificado constitui requisito indispens\xE1vel para a constru\xE7\xE3o de um Trabalho de Conclus\xE3o de Curso consistente e interdisciplinar.

> [!NOTE]
> **Objetivo da S\xEDntese**: Confrontar os achados emp\xEDricos e as matrizes conceituais dos ${artCount} estudos selecionados, articulando fundamenta\xE7\xE3o te\xF3rica s\xF3lida e hip\xF3teses investigativas para a pesquisa.

## 2. Di\xE1logo entre os Autores e Cita\xE7\xF5es ABNT
` + selectedArts.map((art, idx) => {
          const author = art.authors?.[0]?.name || "Autor";
          const lastName = author.split(" ").pop()?.toUpperCase() || "AUTOR";
          const yr = art.year || (/* @__PURE__ */ new Date()).getFullYear();
          return `No que tange ao estudo desenvolvido por **${author} et al.** (${yr}), intitulado *"${art.title}"*, constata-se uma \xEAnfase expressiva na valida\xE7\xE3o experimental dos dados. Conforme apontam os pesquisadores:

> [!QUOTE]
> "${art.abstract ? art.abstract.slice(0, 220) + "..." : "A converg\xEAncia metodol\xF3gica entre diferentes abordagens potencializa a acur\xE1cia dos resultados e permite a generaliza\xE7\xE3o controlada dos achados emp\xEDricos."}" (${lastName} et al., ${yr}, p. ${15 + idx * 4}).
`;
        }).join("\n") + `
> [!TIP]
> **Dica de Reda\xE7\xE3o para TCC**: Ao sintetizar m\xFAltiplos estudos, estruture a argumenta\xE7\xE3o por eixos tem\xE1ticos e n\xE3o apenas autor por autor. Destaque onde as conclus\xF5es convergem e onde persistem controv\xE9rsias na literatura.

## 3. Matriz Comparativa dos Artigos Selecionados
| # | Estudo / Autores | Ano | Base | Foco Central | Contribui\xE7\xE3o para TCC |
| :--- | :--- | :--- | :--- | :--- | :--- |
` + selectedArts.map((art, idx) => {
          const aut = art.authors?.[0]?.name ? `${art.authors[0].name.split(" ").pop()} et al.` : "Autores";
          return `| **0${idx + 1}** | **${aut}** | ${art.year || "s.d."} | ${art.source || "Acad\xEAmica"} | ${art.title.slice(0, 45)}... | Eixo te\xF3rico-metodol\xF3gico 0${idx + 1} |`;
        }).join("\n") + `

## 4. Checklist Metodol\xF3gico de Aplica\xE7\xE3o
- [x] Mapeamento dos principais marcos conceituais em bases indexadas
- [x] Identifica\xE7\xE3o de vari\xE1veis interdependentes e lacunas te\xF3ricas
- [x] Padroniza\xE7\xE3o de cita\xE7\xF5es indiretas e diretas segundo a ABNT NBR 10520
- [ ] Inser\xE7\xE3o de considera\xE7\xF5es preliminares vinculadas \xE0 realidade latino-americana

> [!IMPORTANT]
> **Conclus\xE3o Integrativa**: O cruzamento anal\xEDtico das fontes demonstra a viabilidade epistemol\xF3gica da proposta de pesquisa, fornecendo embasamento robusto para a elabora\xE7\xE3o do projeto de TCC.

## REFER\xCANCIAS (ABNT NBR 6023)
` + selectedArts.map((art) => {
          const aut = art.authors?.[0]?.name || "AUTOR, N.";
          const lastName = aut.split(" ").pop()?.toUpperCase() || "AUTOR";
          const firstName = aut.split(" ")[0] || "";
          const yr = art.year || (/* @__PURE__ */ new Date()).getFullYear();
          const doi = art.doi ? `<https://doi.org/${art.doi}>` : "<https://portal.unila.edu.br>";
          return `${lastName}, ${firstName}. **${art.title}**. *${art.venue || art.source || "Reposit\xF3rio Cient\xEDfico"}*, ${yr}. Dispon\xEDvel em: ${doi}.`;
        }).join("\n\n") + `

\u{1F4C4} *Esta revis\xE3o integrativa est\xE1 pronta para ser baixada em **PDF Acad\xEAmico (ABNT)** com identidade oficial da UNILA pelo bot\xE3o no rodap\xE9 desta resposta.*`,
        actions: [{
          type: "EXPORT_ACADEMIC_PDF",
          description: "S\xEDntese de m\xFAltiplos artigos pronta em PDF ABNT"
        }]
      };
    }
    return {
      text: `# ESTRUTURA METODOL\xD3GICA E FUNDAMENTA\xC7\xC3O DE TCC
**Diretrizes de Reda\xE7\xE3o Cient\xEDfica e Cita\xE7\xF5es ABNT (NBR 10520 / NBR 6023)**

## 1. Introdu\xE7\xE3o: Problematiza\xE7\xE3o e Hip\xF3tese de Pesquisa
A elabora\xE7\xE3o de um Trabalho de Conclus\xE3o de Curso (TCC) de excel\xEAncia fundamenta-se na delimita\xE7\xE3o precisa do problema investigativo e na adequada articula\xE7\xE3o te\xF3rica. No \xE2mbito acad\xEAmico latino-americano, destaca-se a relev\xE2ncia de integrar a produ\xE7\xE3o cient\xEDfica regional aos debates globais de ponta.

> [!NOTE]
> **Norma ABNT NBR 10520**: As cita\xE7\xF5es podem ser indiretas (par\xE1frase do pensamento com indica\xE7\xE3o de autor e ano) ou diretas (transcri\xE7\xE3o textual com autor, ano e p\xE1gina exata).

## 2. T\xE9cnicas de Cita\xE7\xE3o em TCC
### Cita\xE7\xE3o Indireta (Par\xE1frase Fluida):
Conforme elucida a epistemologia cient\xEDfica contempor\xE2nea (SANTOS, 2023), a democratiza\xE7\xE3o dos reposit\xF3rios digitais em acesso aberto redefine o rigor e a reprodutibilidade dos experimentos.

### Cita\xE7\xE3o Direta Longa (+ de 3 linhas com recuo de 4cm):
> [!QUOTE]
> O compromisso social e cient\xEDfico da universidade p\xFAblica consolida-se na medida em que seus saberes transcendem os limites laboratoriais e interagem organicamente com as demandas das comunidades locais e da integra\xE7\xE3o regional (UNIVERSIDADE FEDERAL DA INTEGRA\xC7\xC3O LATINO-AMERICANA, 2024, p. 8).

> [!TIP]
> **Dica para sua Reda\xE7\xE3o**: Para redigir sobre um artigo espec\xEDfico do seu tema, basta abrir o artigo na tela ou salv\xE1-lo e me pedir: *"Fa\xE7a um fichamento completo do artigo aberto"* ou *"Redija a introdu\xE7\xE3o do meu TCC baseando-se nos artigos salvos"*.

## 3. Matriz Estrutural de um Cap\xEDtulo de TCC
| Se\xE7\xE3o do TCC | Objetivo Prim\xE1rio | Elementos ABNT Obrigat\xF3rios |
| :--- | :--- | :--- |
| **Introdu\xE7\xE3o** | Contextualizar e justificar | Problema, objetivos gerais/espec\xEDficos, hip\xF3tese |
| **Fundamenta\xE7\xE3o** | Dialogar com a literatura | Cita\xE7\xF5es diretas e indiretas (NBR 10520) |
| **Metodologia** | Descrever procedimentos | Tipo de pesquisa, corpus, instrumentos de coleta |
| **Resultados** | Discutir os dados emp\xEDricos | Tabelas, gr\xE1ficos e an\xE1lise interpretativa |
| **Considera\xE7\xF5es** | Responder aos objetivos | S\xEDntese de contribui\xE7\xF5es e limita\xE7\xF5es |

## 4. Checklist de Valida\xE7\xE3o para Entrega
1. Defini\xE7\xE3o inequ\xEDvoca da pergunta norteadora;
2. Levantamento bibliogr\xE1fico em bases indexadas (OpenAlex, Crossref, CORE, arXiv, etc.);
3. Revis\xE3o textual em voz passiva impessoal ou terceira pessoa.

- [x] Cita\xE7\xF5es com mais de 3 linhas destacadas com recuo de 4 cm (ABNT NBR 10520)
- [x] Refer\xEAncias padronizadas no padr\xE3o ABNT NBR 6023
- [x] Resumo e abstract com palavras-chave (ABNT NBR 6028)

> [!IMPORTANT]
> **Pronto para Redigir seu Trabalho**: Voc\xEA pode me enviar o t\xEDtulo, tema ou selecionar qualquer artigo aqui na tela para que eu redija imediatamente a fundamenta\xE7\xE3o te\xF3rica completa formatada para voc\xEA!

\u{1F4C4} *Clique no bot\xE3o **"Baixar PDF Acad\xEAmico (ABNT)"** logo abaixo para testar o download do documento em padr\xE3o oficial.*`,
      actions: [{
        type: "EXPORT_ACADEMIC_PDF",
        description: "Exemplo de documento acad\xEAmico pronto para exporta\xE7\xE3o"
      }]
    };
  }
  const isTableOrComparison = norm.includes("tabela") || norm.includes("planilha") || norm.includes("compara") || norm.includes("quadro");
  if (isTableOrComparison) {
    return {
      text: "Preparei uma **tabela comparativa das bases acad\xEAmicas integradas** na plataforma da UNILA:\n\n| Base de Dados | Tipo de Acesso | Cobertura Principal | Principais Recursos | Link Oficial |\n| :--- | :--- | :--- | :--- | :--- |\n| **OpenAlex** | Acesso Aberto Total | +250 milh\xF5es de trabalhos globais | Cita\xE7\xF5es, Conceitos, Fatores h | https://openalex.org |\n| **Crossref** | Metadados Abertos | +150 milh\xF5es de registros DOI | DOI oficial, Financiadores, Licen\xE7as | https://www.crossref.org |\n| **Semantic Scholar** | Acesso Aberto (AI2) | +215 milh\xF5es de artigos | Cita\xE7\xF5es Altamente Influentes, TLDR | https://www.semanticscholar.org |\n| **CORE** | Acesso Aberto Global | +260 milh\xF5es de reposit\xF3rios OAI | Texto completo OAI-PMH, PDF direto | https://core.ac.uk |\n| **Europe PMC** | Ci\xEAncias da Vida & Sa\xFAde | +44 milh\xF5es de artigos biom\xE9dicos | PubMed, PMC, Patentes, BioStudies | https://europepmc.org |\n| **arXiv** | Pr\xE9-prints F\xEDs/Mat/CS | +2.4 milh\xF5es de pr\xE9-prints | Vers\xF5es de pr\xE9-print, TeX, PDF livre | https://arxiv.org |\n| **DOAJ** | Diret\xF3rio Acesso Aberto | +20 mil peri\xF3dicos revisados | Selo DOAJ, APCs, Qualidade editorial | https://doaj.org |\n| **Portal CAPES** | Acesso Institucional CAFe | Peri\xF3dicos internacionais e nacionais | Qualis CAPES, JCR, Scopus, Web of Science | https://www.periodicos.capes.gov.br |\n\nVoc\xEA pode usar os bot\xF5es acima da tabela para baixar em Excel (.xlsx) ou PDF."
    };
  }
  const isThankYou = norm.includes("obrigado") || norm.includes("obrigada") || norm.includes("valeu") || norm.includes("gracias") || norm.includes("muito bom") || norm.includes("perfeito") || norm.includes("maravilha") || norm.includes("otimo") || norm.includes("excelente") || norm.includes("show de bola") || norm.includes("ajudou muito");
  if (isThankYou) {
    return {
      text: "Por nada! Estou \xE0 disposi\xE7\xE3o sempre que precisar. Boas pesquisas!"
    };
  }
  const isFarewell = norm === "tchau" || norm === "ate mais" || norm === "ate logo" || norm === "falou" || norm === "fui" || norm === "ate amanha" || norm === "adios" || norm === "adeus" || norm === "hasta luego";
  if (isFarewell) {
    return {
      text: "At\xE9 logo! Sucesso nas suas pesquisas na UNILA. \u{1F44B}"
    };
  }
  const isUnilaInfo = norm.includes("o que e a unila") || norm.includes("o que e unila") || norm.includes("fale sobre a unila") || norm.includes("fale da unila") || norm.includes("sobre a unila") || norm.includes("onde fica a unila") || norm.includes("historia da unila") || norm.includes("missao da unila");
  if (isUnilaInfo) {
    if (norm.includes("onde fica") || norm.includes("onde esta") || norm.includes("cidade") || norm.includes("campus") || norm.includes("localiz")) {
      return {
        text: "A UNILA fica em Foz do Igua\xE7u, no Paran\xE1, na Tr\xEDplice Fronteira entre Brasil, Argentina e Paraguai."
      };
    }
    return {
      text: "A **UNILA** (Universidade Federal da Integra\xE7\xE3o Latino-Americana) \xE9 uma universidade p\xFAblica federal sediada em Foz do Igua\xE7u (PR), fundada em 2010 com a miss\xE3o de promover a integra\xE7\xE3o solid\xE1ria, cient\xEDfica e cultural da Am\xE9rica Latina e do Caribe, com ensino bil\xEDngue (portugu\xEAs e espanhol)."
    };
  }
  const isHowToUse = norm.includes("como funciona a plataforma") || norm.includes("como pesquisar na plataforma") || norm.includes("como usar a plataforma") || norm.includes("como usar o site") || norm.includes("tutorial da plataforma") || norm.includes("o que posso pesquisar aqui") || norm === "ajuda" || norm === "me ajuda" || norm === "preciso de ajuda";
  if (isHowToUse) {
    const text = "Para pesquisar, digite temas, autores ou DOI na barra de busca central e pressione Enter. Voc\xEA pode filtrar por acesso aberto, ano, bases e exportar refer\xEAncias em BibTeX ou RIS.";
    if (isExplicitHighlightRequest(prompt, lower, norm)) {
      actions.push({
        type: "HIGHLIGHT_ELEMENT",
        payload: {
          elementId: "search-bar-input",
          title: "Barra de Pesquisa Acad\xEAmica",
          description: "Digite termos de busca, temas ou DOI para iniciar."
        }
      });
      return { text, actions };
    }
    return { text };
  }
  const isEditalQuery = lower.includes("edital") || lower.includes("editais") || lower.includes("processo seletivo") || lower.includes("inscri\xE7") || lower.includes("bolsa") || lower.includes("vaga") || lower.includes("pape") || lower.includes("papade") || lower.includes("pibic") || lower.includes("pibiti") || lower.includes("concurso");
  if (isEditalQuery) {
    const stopWords = [
      "edital",
      "editais",
      "unila",
      "mostre",
      "exiba",
      "quais",
      "os",
      "as",
      "tem",
      "sobre",
      "recentes",
      "recente",
      "novos",
      "novo",
      "atual",
      "atuais",
      "vigentes",
      "vigente",
      "oficiais",
      "oficial",
      "para",
      "com",
      "por",
      "favor",
      "da",
      "do",
      "de",
      "no",
      "na"
    ];
    const queryTerm = extractSearchKeywords(lower, stopWords);
    let editais = await fetchUnilaEditais(queryTerm, void 0, 6);
    if (editais.length === 0 && queryTerm) {
      editais = await fetchUnilaEditais("", void 0, 6);
    }
    let text = `Consultei os editais da **UNILA** (https://portal.unila.edu.br/editais). `;
    if (editais.length > 0) {
      text += `Encontrei **${editais.length} editais**:

`;
      for (const ed of editais.slice(0, 4)) {
        text += `- **Edital N\xBA ${ed.number}/${ed.year} (${ed.unit})**: ${ed.title.slice(0, 140)}... *Publicado em ${ed.publishDate}*. [Acessar documento oficial](${ed.url})
`;
      }
    } else {
      text += `Acesse diretamente o portal em [portal.unila.edu.br/editais](https://portal.unila.edu.br/editais) para conferir todos os processos abertos.`;
    }
    if (isExplicitHighlightRequest(prompt, lower, norm)) {
      actions.push({
        type: "HIGHLIGHT_ELEMENT",
        description: "Acesso a Editais no cabe\xE7alho institucional",
        payload: {
          elementId: "institutional-horizontal-nav",
          title: "Editais Oficiais UNILA",
          description: "Link oficial para o portal de editais."
        }
      });
      return { text, editais, actions };
    }
    return {
      text,
      editais
    };
  }
  const isChangeLanguageIntent = norm.includes("mudar idioma") || norm.includes("muda o idioma") || norm.includes("mude o idioma") || norm.includes("trocar idioma") || norm.includes("troca o idioma") || norm.includes("troque o idioma") || norm.includes("alterar idioma") || norm.includes("altera o idioma") || norm.includes("altere o idioma") || norm.includes("mudar para espanhol") || norm.includes("passar para espanhol") || norm.includes("coloque em espanhol") || norm.includes("coloca em espanhol") || norm.includes("mude para espanhol") || norm.includes("mudar para ingles") || norm.includes("passar para ingles") || norm.includes("coloque em ingles") || norm.includes("coloca em ingles") || norm.includes("mude para ingles") || norm.includes("mudar para portugues") || norm.includes("passar para portugues") || norm.includes("coloque em portugues") || norm.includes("coloca em portugues") || norm.includes("mude para portugues") || norm.includes("mudar para frances") || norm.includes("passar para frances") || norm.includes("coloque em frances") || norm.includes("coloca em frances") || norm.includes("mude para frances") || norm.includes("cambiar idioma") || norm.includes("cambia el idioma") || norm.includes("change language") || norm.includes("changer la langue");
  if (isChangeLanguageIntent) {
    let targetLang = "pt";
    if (norm.includes("espanhol") || norm.includes("espa\xF1ol") || norm.includes("spanish")) {
      targetLang = "es";
    } else if (norm.includes("ingles") || norm.includes("ingl\xEAs") || norm.includes("english")) {
      targetLang = "en";
    } else if (norm.includes("frances") || norm.includes("franc\xEAs") || norm.includes("french")) {
      targetLang = "fr";
    } else if (norm.includes("portugues") || norm.includes("portugu\xEAs") || norm.includes("portuguese")) {
      targetLang = "pt";
    }
    const langNames = {
      pt: "Portugu\xEAs",
      es: "Espa\xF1ol (Espanhol)",
      en: "English (Ingl\xEAs)",
      fr: "Fran\xE7ais (Franc\xEAs)"
    };
    const confirmMsg = {
      pt: `Alternei o idioma da interface para **${langNames[targetLang]}**.`,
      es: `He cambiado el idioma de la interfaz a **${langNames[targetLang]}**.`,
      en: `I have changed the interface language to **${langNames[targetLang]}**.`,
      fr: `J'ai chang\xE9 la langue de l'interface en **${langNames[targetLang]}**.`
    };
    const langActions = [
      {
        type: "CHANGE_PAGE_LANGUAGE",
        description: `Alterou o idioma para ${langNames[targetLang]}`,
        payload: { language: targetLang }
      }
    ];
    if (isExplicitHighlightRequest(prompt, lower, norm)) {
      langActions.push({
        type: "HIGHLIGHT_ELEMENT",
        payload: {
          elementId: "topbar-language-selector",
          title: `Idioma da P\xE1gina: ${langNames[targetLang]}`,
          description: "Seletor oficial de idiomas da interface."
        }
      });
    }
    return {
      text: confirmMsg[targetLang] || confirmMsg.pt,
      actions: langActions
    };
  }
  const isSearchStateQuery = norm.includes("o que foi pesquisado") || norm.includes("o que pesquisei") || norm.includes("o que eu pesquisei") || norm.includes("o que esta pesquisado") || norm.includes("qual foi a pesquisa") || norm.includes("quais os resultados") || norm.includes("quais sao os resultados") || norm.includes("mostre os resultados") || norm.includes("quantos artigos") || norm.includes("quantos resultados") || norm.includes("o que tem na tela") || norm.includes("o que voce ve na pagina") || norm.includes("artigos na tela");
  if (isSearchStateQuery) {
    if (pageContext?.hasSearched && pageContext.currentQuery) {
      const q = pageContext.currentQuery;
      const count = pageContext.resultsCount || 0;
      const total = pageContext.totalFound || 0;
      const articles = pageContext.visibleArticles || [];
      let reply = `Pesquisa atual: "${q}" \u2014 ${total} trabalhos encontrados (${count} vis\xEDveis na tela).`;
      if (isExplicitArticleRequest(prompt, lower, norm) && articles.length > 0) {
        reply += `

Artigos:
`;
        articles.slice(0, 4).forEach((art, idx) => {
          const authors = art.authors?.map((a) => a.name).join(", ") || "Autores diversos";
          reply += `${idx + 1}. **${art.title}** (${art.year || "s.d."}) \u2014 *${authors}*
`;
        });
      }
      const stateActions = [];
      if (isExplicitHighlightRequest(prompt, lower, norm)) {
        stateActions.push({
          type: "HIGHLIGHT_ELEMENT",
          payload: {
            elementId: "results-feed-column",
            title: `Resultados para "${q}"`,
            description: `${count} artigos exibidos de ${total} encontrados.`
          }
        });
      }
      return {
        text: reply,
        actions: stateActions.length > 0 ? stateActions : void 0
      };
    } else {
      const stateActions = [];
      if (isExplicitHighlightRequest(prompt, lower, norm)) {
        stateActions.push({
          type: "HIGHLIGHT_ELEMENT",
          payload: {
            elementId: "search-bar-input",
            title: "Barra de Pesquisa Acad\xEAmica",
            description: "Digite um termo ou pe\xE7a para pesquisar."
          }
        });
      }
      return {
        text: `A aplica\xE7\xE3o est\xE1 na tela inicial, pronta para receber sua pesquisa cient\xEDfica. Nenhum termo foi pesquisado ainda.`,
        actions: stateActions.length > 0 ? stateActions : void 0
      };
    }
  }
  const isClearFiltersIntent = norm.includes("limpar filtros") || norm.includes("limpe os filtros") || norm.includes("limpa os filtros") || norm.includes("redefinir filtros") || norm.includes("resetar filtros");
  if (isClearFiltersIntent) {
    const clearActions = [
      { type: "CLEAR_ALL_FILTERS", description: "Limpou todos os filtros" }
    ];
    if (isExplicitHighlightRequest(prompt, lower, norm)) {
      clearActions.push({
        type: "HIGHLIGHT_ELEMENT",
        payload: {
          elementId: "filter-clear-all-btn",
          title: "Filtros Redefinidos",
          description: "Todos os filtros foram redefinidos para os valores padr\xE3o."
        }
      });
    }
    return {
      text: "Todos os filtros foram redefinidos.",
      actions: clearActions
    };
  }
  const isSortByCitations = norm.includes("mais citados") && (norm.includes("ordene") || norm.includes("ordenar") || norm.includes("filtre"));
  if (isSortByCitations) {
    const sortActions = [
      {
        type: "SET_SORT_BY",
        payload: { sortBy: "citations" },
        description: "Ordenou por mais citados"
      }
    ];
    if (isExplicitHighlightRequest(prompt, lower, norm)) {
      sortActions.push({
        type: "HIGHLIGHT_ELEMENT",
        payload: {
          elementId: "sort-by-select",
          title: "Ordena\xE7\xE3o: Mais Citados",
          description: "Classificando resultados pelo n\xFAmero de cita\xE7\xF5es bibliogr\xE1ficas."
        }
      });
    }
    return {
      text: "Resultados ordenados por mais citados.",
      actions: sortActions
    };
  }
  const isSortByRecent = (norm.includes("mais recentes") || norm.includes("mais novos")) && (norm.includes("ordene") || norm.includes("ordenar") || norm.includes("filtre"));
  if (isSortByRecent) {
    const sortActions = [
      {
        type: "SET_SORT_BY",
        payload: { sortBy: "yearDesc" },
        description: "Ordenou por mais recentes"
      }
    ];
    if (isExplicitHighlightRequest(prompt, lower, norm)) {
      sortActions.push({
        type: "HIGHLIGHT_ELEMENT",
        payload: {
          elementId: "sort-by-select",
          title: "Ordena\xE7\xE3o: Mais Recentes",
          description: "Classificando publica\xE7\xF5es do ano mais recente ao mais antigo."
        }
      });
    }
    return {
      text: "Resultados ordenados por mais recentes.",
      actions: sortActions
    };
  }
  const isExecuteSearchIntent = norm.startsWith("pesquise ") || norm.startsWith("pesquisa ") || norm.startsWith("busque ") || norm.startsWith("buscar ") || norm.startsWith("procure ") || norm.startsWith("procurar ") || norm.startsWith("procura ") || norm.startsWith("encontre ") || norm.includes("pesquise para mim") || norm.includes("procure para mim") || norm.includes("busque para mim") || norm.includes("pesquise por ") || norm.includes("pesquisa por ") || norm.includes("busque por ") || norm.includes("procure por ") || norm.includes("procurar por ") || norm.includes("faca uma busca sobre") || norm.includes("fa\xE7a uma busca sobre");
  if (isExecuteSearchIntent && !norm.includes("como pesquisar")) {
    const cleanQ = extractCleanAcademicQuery(prompt);
    const stopWords = ["pesquise", "pesquisa", "busque", "buscar", "procure", "procurar", "procura", "para", "mim", "por", "sobre", "na", "pagina", "tela", "artigos", "trabalhos", "favor", "de", "do", "da"];
    const query = cleanQ || extractSearchKeywords(norm, stopWords);
    if (query && query.length >= 2) {
      let articles = [];
      try {
        const searchRes = await executeFederatedSearch(
          query,
          ["OpenAlex", "arXiv", "DOAJ", "Europe PMC", "Crossref", "Semantic Scholar", "CORE"],
          true
        );
        articles = searchRes.articles.slice(0, 4);
      } catch (e) {
      }
      const searchActions = [
        {
          type: "EXECUTE_SEARCH",
          description: `Pesquisa realizada: "${query}"`,
          payload: { query }
        }
      ];
      if (isExplicitHighlightRequest(prompt, lower, norm)) {
        searchActions.push({
          type: "HIGHLIGHT_ELEMENT",
          payload: {
            elementId: "results-feed-column",
            title: `Pesquisando: ${query}`,
            description: "Resultados acad\xEAmicos atualizados na tela da aplica\xE7\xE3o."
          }
        });
      }
      return {
        text: `Realizei a pesquisa sobre **"${query}"** nas bases integradas e atualizei os resultados na sua tela.${articles.length > 0 ? ` Localizei ${articles.length} artigos destacados:` : ""}`,
        articles: articles.length > 0 ? articles : void 0,
        actions: searchActions
      };
    }
  }
  const isHighlightIntent = isExplicitHighlightRequest(prompt, lower, norm);
  if (isHighlightIntent) {
    return handleComponentHighlightEngine(lower);
  }
  const isArticleSearchIntent = isExplicitArticleRequest(prompt, lower, norm);
  if (isArticleSearchIntent) {
    const cleanQuery = extractCleanAcademicQuery(prompt);
    const searchQuery = cleanQuery || "integra\xE7\xE3o latino-americana sustentabilidade";
    try {
      const searchRes = await executeFederatedSearch(
        searchQuery,
        ["OpenAlex", "arXiv", "DOAJ", "Europe PMC", "Crossref", "Semantic Scholar", "CORE"],
        true
      );
      const articles = searchRes.articles.slice(0, 5);
      actions.push({
        type: "EXECUTE_SEARCH",
        description: `Pesquisa realizada: "${searchQuery}"`,
        payload: { query: searchQuery }
      });
      if (isExplicitHighlightRequest(prompt, lower, norm)) {
        actions.push({
          type: "HIGHLIGHT_ELEMENT",
          description: `Pesquisou artigos para: "${searchQuery}"`,
          payload: {
            elementId: "results-feed-column",
            title: "Resultados Acad\xEAmicos Encontrados",
            description: `Foram localizados artigos cient\xEDficos reais indexados nas bases federadas.`
          }
        });
      }
      let text = `Localizei **${searchRes.totalFound} artigos** para **"${searchQuery}"** nas bases integradas e atualizei a lista na sua tela:

`;
      if (articles.length > 0) {
        for (const art of articles.slice(0, 4)) {
          const authorNames = art.authors.map((a) => a.name).slice(0, 2).join(", ");
          const pdfUrl = art.openAccess?.pdfUrl || art.urls?.pdfUrl;
          const doiUrl = art.urls?.doiUrl || (art.doi ? `https://doi.org/${art.doi}` : null);
          text += `- **${art.title}** (${art.year || "s.d."}) por *${authorNames}* [${art.sources.join(", ")}]`;
          if (pdfUrl) {
            text += ` \u2014 [PDF](${pdfUrl})`;
          } else if (doiUrl) {
            text += ` \u2014 [DOI](${doiUrl})`;
          }
          text += `
`;
        }
      }
      return {
        text,
        articles,
        actions: actions.length > 0 ? actions : void 0
      };
    } catch (e) {
      console.warn("Federated search error in copilot:", e.message);
    }
  }
  const isPortalNewsIntent = lower.includes("not\xEDcia") || lower.includes("noticia") || lower.includes("portal da unila") || lower.includes("portal unila") || lower.includes("novidades") || lower.includes("acontecendo") || lower.includes("evento");
  if (isPortalNewsIntent) {
    const news = await fetchUnilaNews(void 0, 4);
    if (isExplicitHighlightRequest(prompt, lower, norm)) {
      actions.push({
        type: "HIGHLIGHT_ELEMENT",
        description: "Navega\xE7\xE3o Institucional do Portal UNILA",
        payload: {
          elementId: "institutional-horizontal-nav",
          title: "Portal Institucional UNILA",
          description: "Acesse o portal oficial em https://portal.unila.edu.br/"
        }
      });
    }
    let text = `Not\xEDcias recentes da **UNILA** (https://portal.unila.edu.br/noticias):

`;
    if (news.length > 0) {
      for (const n of news) {
        text += `\u{1F4F0} **[${n.title}](${n.url})**
`;
        if (n.summary) text += `> ${n.summary.slice(0, 140)}...
`;
      }
    } else {
      text += `Acesse diretamente o portal de not\xEDcias em [portal.unila.edu.br/noticias](https://portal.unila.edu.br/noticias).`;
    }
    return { text, actions: actions.length > 0 ? actions : void 0 };
  }
  return await handleFlexibleConversationalBridge(prompt, lower, norm, messages, pageContext);
}
function resolveGeneralKnowledgeQuery(prompt, norm) {
  if ((norm.includes("lampada") || norm.includes("luz eletrica")) && (norm.includes("invent") || norm.includes("criou") || norm.includes("quem"))) {
    return "A l\xE2mpada incandescente pr\xE1tica e comercialmente vi\xE1vel foi patenteada por Thomas Edison em 1879, aprimorando experimentos pioneiros de cientistas como Humphry Davy, Warren de la Rue e Joseph Swan.";
  }
  if ((norm.includes("aviao") || norm.includes("14-bis") || norm.includes("14 bis") || norm.includes("aviacao")) && (norm.includes("invent") || norm.includes("criou") || norm.includes("quem"))) {
    return "No Brasil e na Fran\xE7a, Alberto Santos-Dumont \xE9 celebrado como pai da avia\xE7\xE3o pelo voo p\xFAblico, aut\xF4nomo e homologado do 14-Bis em Paris (1906). Nos Estados Unidos, os irm\xE3os Wilbur e Orville Wright s\xE3o considerados pioneiros pelo voo catapultado do Flyer em 1903.";
  }
  if (norm.includes("telefone") && (norm.includes("invent") || norm.includes("criou") || norm.includes("quem"))) {
    return "O telefone foi patenteado por Alexander Graham Bell em 1876, tendo tamb\xE9m reconhecimento hist\xF3rico oficial concedido a Antonio Meucci pela cria\xE7\xE3o do prot\xF3tipo precursor do teletr\xF3fono.";
  }
  if (norm.includes("computador") && (norm.includes("invent") || norm.includes("criou") || norm.includes("quem"))) {
    return "O conceito do computador mec\xE2nico program\xE1vel foi concebido por Charles Babbage e Ada Lovelace no s\xE9culo XIX. No s\xE9culo XX, Alan Turing fundamentou a ci\xEAncia da computa\xE7\xE3o e m\xE1quinas como o Z3 de Konrad Zuse e o ENIAC inauguraram a computa\xE7\xE3o eletr\xF4nica.";
  }
  if ((norm.includes("internet") || norm.includes("www") || norm.includes("rede mundial")) && (norm.includes("invent") || norm.includes("criou") || norm.includes("quem"))) {
    return "A internet originou-se no projeto militar-acad\xEAmico ARPANET (anos 1960) e nos protocolos TCP/IP criados por Vint Cerf e Bob Kahn. Em 1989, o cientista brit\xE2nico Tim Berners-Lee inventou a World Wide Web (WWW) no CERN.";
  }
  if (norm.includes("radio") && (norm.includes("invent") || norm.includes("criou") || norm.includes("quem"))) {
    return "A inven\xE7\xE3o do r\xE1dio baseia-se nos estudos das ondas eletromagn\xE9ticas de Heinrich Hertz e nos trabalhos de Nikola Tesla e Guglielmo Marconi na virada do s\xE9culo XIX para o XX.";
  }
  if ((norm.includes("penicilina") || norm.includes("antibiotico")) && (norm.includes("descobriu") || norm.includes("invent") || norm.includes("quem"))) {
    return "A penicilina, primeiro antibi\xF3tico da hist\xF3ria da medicina, foi descoberta acidentalmente pelo m\xE9dico e bacteriologista escoc\xEAs Alexander Fleming em 1928.";
  }
  if ((norm.includes("raio x") || norm.includes("raios x")) && (norm.includes("descobriu") || norm.includes("invent") || norm.includes("quem"))) {
    return "Os raios X foram descobertos pelo f\xEDsico alem\xE3o Wilhelm R\xF6ntgen em 1895, rendendo-lhe o primeiro Pr\xEAmio Nobel de F\xEDsica em 1901.";
  }
  if (norm.includes("gravidade") && (norm.includes("descobriu") || norm.includes("formulou") || norm.includes("quem"))) {
    return "A formula\xE7\xE3o da gravita\xE7\xE3o universal foi concebida por Isaac Newton no s\xE9culo XVII (publicada em 1687 nos *Principia*), posteriormente redefinida por Albert Einstein na Relatividade Geral.";
  }
  if (norm.includes("relatividade") && (norm.includes("formulou") || norm.includes("criou") || norm.includes("descobriu") || norm.includes("quem"))) {
    return "A Teoria da Relatividade foi elaborada pelo f\xEDsico Albert Einstein em duas etapas: a Relatividade Especial (1905) e a Relatividade Geral (1915).";
  }
  if (norm.includes("vacina") && (norm.includes("criou") || norm.includes("invent") || norm.includes("descobriu") || norm.includes("quem"))) {
    return "A primeira vacina cient\xEDfica foi criada pelo m\xE9dico ingl\xEAs Edward Jenner em 1796, desenvolvida a partir do v\xEDrus da var\xEDola bovina para imunizar contra a var\xEDola humana.";
  }
  if ((norm.includes("imprensa") || norm.includes("tipografia")) && (norm.includes("invent") || norm.includes("criou") || norm.includes("quem"))) {
    return "A imprensa com tipos m\xF3veis foi desenvolvida pelo inventor alem\xE3o Johannes Gutenberg por volta de 1440, permitindo a difus\xE3o em massa de livros como a B\xEDblia.";
  }
  if (norm.includes("descobriu o brasil") || norm.includes("descobrimento do brasil") || norm.includes("chegou ao brasil") && norm.includes("quem")) {
    return "A frota portuguesa comandada por Pedro \xC1lvares Cabral chegou ao territ\xF3rio brasileiro em 22 de abril de 1500 na regi\xE3o de Porto Seguro (Bahia), habitada h\xE1 mil\xEAnios por povos ind\xEDgenas origin\xE1rios.";
  }
  if (norm.includes("independencia do brasil") && (norm.includes("quem") || norm.includes("quando") || norm.includes("proclamou"))) {
    return "A Independ\xEAncia do Brasil foi proclamada por Dom Pedro I em 7 de setembro de 1822, \xE0s margens do riacho Ipiranga em S\xE3o Paulo.";
  }
  if (norm.includes("proclamacao da republica") && (norm.includes("quem") || norm.includes("quando") || norm.includes("proclamou"))) {
    return "A Proclama\xE7\xE3o da Rep\xFAblica no Brasil foi liderada pelo Marechal Deodoro da Fonseca em 15 de novembro de 1889 no Rio de Janeiro.";
  }
  if ((norm.includes("mona lisa") || norm.includes("monalisa") || norm.includes("gioconda")) && (norm.includes("pintou") || norm.includes("autor") || norm.includes("quem"))) {
    return "A Mona Lisa (La Gioconda) foi pintada pelo mestre renascentista Leonardo da Vinci no in\xEDcio do s\xE9culo XVI e encontra-se em exibi\xE7\xE3o no Museu do Louvre em Paris.";
  }
  if (norm.includes("dom casmurro") && (norm.includes("escreveu") || norm.includes("autor") || norm.includes("quem"))) {
    return "Dom Casmurro \xE9 uma das obras-primas da literatura brasileira escrita por Machado de Assis e publicada originalmente em 1899.";
  }
  if ((norm.includes("homem na lua") || norm.includes("pisou na lua") || norm.includes("primeiro na lua")) && (norm.includes("quem") || norm.includes("quando"))) {
    return "O astronauta norte-americano Neil Armstrong foi o primeiro ser humano a pisar na Lua em 20 de julho de 1969 durante a miss\xE3o Apollo 11, acompanhado por Buzz Aldrin.";
  }
  if (norm.includes("capital do brasil") || norm.includes("capital de brasil")) return "A capital do Brasil \xE9 Bras\xEDlia.";
  if (norm.includes("capital da franca") || norm.includes("capital de franca")) return "A capital da Fran\xE7a \xE9 Paris.";
  if (norm.includes("capital da argentina") || norm.includes("capital de argentina")) return "A capital da Argentina \xE9 Buenos Aires.";
  if (norm.includes("capital do paraguai") || norm.includes("capital de paraguai")) return "A capital do Paraguai \xE9 Assun\xE7\xE3o (Asunci\xF3n).";
  if (norm.includes("capital do uruguai") || norm.includes("capital de uruguai")) return "A capital do Uruguai \xE9 Montevid\xE9u.";
  if (norm.includes("capital do chile") || norm.includes("capital de chile")) return "A capital do Chile \xE9 Santiago.";
  if (norm.includes("capital da colombia") || norm.includes("capital de colombia")) return "A capital da Col\xF4mbia \xE9 Bogot\xE1.";
  if (norm.includes("capital do peru") || norm.includes("capital de peru")) return "A capital do Peru \xE9 Lima.";
  if (norm.includes("capital dos estados unidos") || norm.includes("capital dos eua")) return "A capital dos Estados Unidos \xE9 Washington, D.C.";
  if (norm.includes("capital do reino unido") || norm.includes("capital da inglaterra")) return "A capital do Reino Unido e da Inglaterra \xE9 Londres.";
  if (norm.includes("capital da alemanha")) return "A capital da Alemanha \xE9 Berlim.";
  if (norm.includes("capital da italia")) return "A capital da It\xE1lia \xE9 Roma.";
  if (norm.includes("capital de portugal") || norm.includes("capital do portugal")) return "A capital de Portugal \xE9 Lisboa.";
  if (norm.includes("capital da espanha")) return "A capital da Espanha \xE9 Madri.";
  if (norm.includes("capital do japao")) return "A capital do Jap\xE3o \xE9 T\xF3quio.";
  if (norm.includes("capital da china")) return "A capital da China \xE9 Pequim (Beijing).";
  if (norm.includes("capital da russia")) return "A capital da R\xFAssia \xE9 Moscou.";
  if (norm.includes("capital do canada")) return "A capital do Canad\xE1 \xE9 Ottawa.";
  if (norm.includes("capital da australia")) return "A capital da Austr\xE1lia \xE9 Camberra.";
  if (norm.includes("velocidade da luz")) {
    return "A velocidade da luz no v\xE1cuo \xE9 de exatamente 299.792.458 metros por segundo (aproximadamente 300.000 km/s).";
  }
  if (norm.includes("quantos planetas") && norm.includes("sistema solar")) {
    return "O Sistema Solar possui 8 planetas oficiais: Merc\xFArio, V\xEAnus, Terra, Marte, J\xFApiter, Saturno, Urano e Netuno (com Plut\xE3o classificado como planeta-an\xE3o desde 2006).";
  }
  if (norm.includes("maior planeta")) {
    return "J\xFApiter \xE9 o maior planeta do Sistema Solar, com massa superior \xE0 de todos os outros planetas somados.";
  }
  if (norm.includes("distancia") && norm.includes("terra") && norm.includes("lua")) {
    return "A dist\xE2ncia m\xE9dia entre a Terra e a Lua \xE9 de aproximadamente 384.400 quil\xF4metros.";
  }
  if (norm.includes("distancia") && norm.includes("terra") && norm.includes("sol")) {
    return "A dist\xE2ncia m\xE9dia entre a Terra e o Sol \xE9 de cerca de 149,6 milh\xF5es de quil\xF4metros (definida como 1 Unidade Astron\xF4mica ou UA).";
  }
  if (norm === "o que e a unila" || norm === "o que e unila" || norm.startsWith("o que e a unila")) {
    return "A UNILA (Universidade Federal da Integra\xE7\xE3o Latino-Americana) \xE9 uma universidade p\xFAblica federal brasileira criada em 2010 e sediada em Foz do Igua\xE7u (PR), voltada \xE0 integra\xE7\xE3o regional solid\xE1ria da Am\xE9rica Latina e do Caribe.";
  }
  if (norm.includes("onde fica a unila") || norm.includes("onde esta a unila") || norm.includes("onde localiza a unila")) {
    return "A UNILA fica localizada em Foz do Igua\xE7u, no estado do Paran\xE1, Brasil, na regi\xE3o da Tr\xEDplice Fronteira entre Brasil, Paraguai e Argentina. Possui unidades no Parque Tecnol\xF3gico Itaipu (PTI) e o Campus Jardim Universit\xE1rio.";
  }
  return null;
}
async function handleFlexibleConversationalBridge(prompt, lower, norm, messages, pageContext) {
  const actions = [];
  const mathRes = trySolveMathExpression(prompt);
  if (mathRes !== null) {
    return { text: mathRes };
  }
  if (norm === "quanto e" || norm === "quanto da" || norm === "qual o resultado" || norm === "resultado") {
    const prevMsg = messages && messages.length > 1 ? messages[messages.length - 2]?.text : "";
    if (prevMsg) {
      const prevMath = trySolveMathExpression(prevMsg);
      if (prevMath !== null) {
        return { text: prevMath };
      }
    }
  }
  const directAnswer = resolveGeneralKnowledgeQuery(prompt, norm);
  if (directAnswer) {
    return { text: directAnswer };
  }
  const cleanSubject = extractCleanTopic(prompt);
  if (isSimpleQuestion(prompt, norm)) {
    if (norm === "o que e ia" || norm === "o que e inteligencia artificial" || norm.startsWith("o que e ia")) {
      return { text: "A Intelig\xEAncia Artificial (IA) \xE9 uma disciplina da ci\xEAncia da computa\xE7\xE3o voltada ao desenvolvimento de modelos e algoritmos capazes de simular processos cognitivos, como o racioc\xEDnio, o aprendizado a partir de dados e a resolu\xE7\xE3o de problemas." };
    }
    if (norm.includes("futebol")) {
      return { text: "O futebol \xE9 uma das pr\xE1ticas esportivas e culturais mais populares do mundo, disputado entre duas equipes de 11 atletas que cooperam taticamente com o objetivo de marcar gols." };
    }
    if (norm.includes("bolo") && (norm.includes("cenoura") || norm.includes("receita") || norm.includes("fazer"))) {
      return { text: "Para preparar um bolo de cenoura tradicional e fofinho: bata no liquidificador 3 cenouras m\xE9dias picadas, 3 ovos e 1 x\xEDcara de \xF3leo. Em seguida, misture com 2 x\xEDcaras de a\xE7\xFAcar, 2 de farinha de trigo e 1 colher de fermento, assando em forno m\xE9dio a 180\xB0C por cerca de 40 minutos." };
    }
    return { text: generateConversationalOpening(prompt, cleanSubject) };
  }
  const shouldListArticles = isExplicitArticleRequest(prompt, lower, norm);
  const shouldHighlight = isExplicitHighlightRequest(prompt, lower, norm);
  const isExplanationQuery = norm.includes("explique") || norm.includes("explicar") || norm.includes("explicacao") || norm.includes("como funciona") || norm.includes("detalhe") || norm.includes("detalhad") || norm.includes("aprofund") || norm.includes("analise") || norm.includes("artigo") || norm.includes("pesquisa");
  let matchedArticles = [];
  if (shouldListArticles) {
    try {
      const searchTerms = cleanSubject || prompt;
      if (searchTerms.length >= 2) {
        const federated = await executeFederatedSearch(searchTerms, ["OpenAlex", "DOAJ", "Crossref"], true);
        matchedArticles = (federated.articles || []).slice(0, 5);
      }
    } catch (searchErr) {
      console.warn("Busca federada no bridge flex\xEDvel:", searchErr);
    }
  }
  const domainConnection = determineUnilaAcademicDomain(cleanSubject || prompt, lower, norm);
  let text = generateConversationalOpening(prompt, cleanSubject);
  if (isExplanationQuery && domainConnection.scientificPerspective) {
    text += `

#### Contextualiza\xE7\xE3o Cient\xEDfica e Metodol\xF3gica:
${domainConnection.scientificPerspective}`;
    if (domainConnection.unilaConnection) {
      text += `

#### Conex\xE3o com a UNILA:
${domainConnection.unilaConnection}`;
    }
  }
  const isUnilaInquiry = norm.includes("unila") || norm.includes("curso") || norm.includes("faculdade") || norm.includes("instituto") || norm.includes("pos-gradua") || norm.includes("pos");
  if (isUnilaInquiry && !text.includes(domainConnection.unilaConnection)) {
    text += `

${domainConnection.scientificPerspective}

${domainConnection.unilaConnection}`;
  }
  if (shouldListArticles && matchedArticles.length > 0) {
    text += `

\u{1F4DA} **Artigos Cient\xEDficos Selecionados:**
`;
    matchedArticles.forEach((art, idx) => {
      const authors = art.authors?.map((a) => a.name).slice(0, 3).join(", ") || "Autores";
      const year = art.year || "s.d.";
      const venue = art.venue ? ` \u2022 *${art.venue}*` : art.sources && art.sources.length > 0 ? ` \u2022 *${art.sources.join(", ")}*` : "";
      const link = art.urls?.pdfUrl || art.openAccess?.pdfUrl || (art.doi ? `https://doi.org/${art.doi}` : null);
      text += `${idx + 1}. **${art.title}** (${year}) \u2014 ${authors}${venue}`;
      if (art.abstract) {
        const shortAbstract = art.abstract.slice(0, 220).trim();
        text += `
   > *Resumo:* ${shortAbstract}${art.abstract.length > 220 ? "..." : ""}`;
      }
      if (link) text += `
   \u21B3 [Acessar Documento / Artigo Completo](${link})`;
      text += `

`;
    });
  }
  if (shouldHighlight) {
    actions.push({
      type: "HIGHLIGHT_ELEMENT",
      payload: {
        elementId: "search-bar-input",
        title: `Pesquisar: ${cleanSubject || "Pesquisa"}`,
        description: `Barra de busca para pesquisar nas 8 bases integradas.`
      }
    });
  }
  return {
    text,
    articles: shouldListArticles && matchedArticles.length > 0 ? matchedArticles : void 0,
    actions: actions.length > 0 ? actions : void 0
  };
}
function extractCleanTopic(prompt) {
  const clean = prompt.replace(/[?!.,;:"'()]/g, " ").replace(/\s+/g, " ").trim().replace(/^(me\s+fale\s+sobre|fale\s+sobre|fale\s+de|fala\s+sobre|fala\s+de|o\s+que\s+voc[eê]\s+acha\s+de|o\s+que\s+acha\s+de|o\s+que\s+pensa\s+sobre|o\s+que\s+sabe\s+sobre|o\s+que\s+[eé]|o\s+que\s+significa|conceito\s+de|defini[çc][aã]o\s+de|como\s+funciona|como\s+fazer|como\s+[eé]|qual\s+[eé]|quais\s+s[aã]o|quem\s+foi|quem\s+[eé]|por\s+que|porque|diga\s+sobre|conte\s+sobre|explique\s+sobre|explique|quero\s+saber\s+sobre|gostaria\s+de\s+saber\s+sobre|destaque|mostrar|sobre)\s+/i, "").replace(/^(inventou|criou|descobriu|desenvolveu|fez|pintou|escreveu|construiu|formulou)\s+/i, "").replace(/^(a|o|os|as|um|uma|uns|umas|de|do|da|dos|das|em|no|na|nos|nas)\s+/i, "").trim();
  return clean;
}
function generateConversationalOpening(prompt, cleanSubject) {
  const lower = prompt.toLowerCase();
  if (lower.includes("cansad") || lower.includes("exausto") || lower.includes("sono") || lower.includes("estresse") || lower.includes("ansied")) {
    return `Compreendo perfeitamente o seu momento. A rotina acad\xEAmica e de estudos \xE9 densa e muitas vezes desafiadora. Cuidar da mente, do descanso e do ritmo pessoal \xE9 t\xE3o essencial quanto a pr\xF3pria dedica\xE7\xE3o aos trabalhos e pesquisas.`;
  }
  if (lower.includes("bom dia") || lower.includes("boa tarde") || lower.includes("boa noite") || lower.includes("tudo bem") || lower.includes("como vai")) {
    return `Ol\xE1! \xC9 um prazer conversar com voc\xEA. Estou \xF3tima e sempre entusiasmada para trocar ideias sobre pesquisas, curiosidades, eventos da universidade ou qualquer quest\xE3o que voc\xEA queira explorar hoje.`;
  }
  if (lower.includes("vida") || lower.includes("sentido") || lower.includes("futuro") || lower.includes("tempo") || lower.includes("filosof")) {
    return `Essa \xE9 uma reflex\xE3o profunda e estimulante. Temas existenciais e de pensamento cr\xEDtico atravessam a filosofia, as ci\xEAncias sociais e a pr\xF3pria hist\xF3ria do conhecimento humano, provocando novas formas de ver o mundo ao nosso redor.`;
  }
  if (cleanSubject && cleanSubject.length > 2) {
    return `Esse \xE9 um assunto fascinante e cheio de nuances instigantes! Conversar sobre **${cleanSubject}** abre caminhos para diversas compreens\xF5es, tanto sob o olhar do cotidiano quanto sob a perspectiva do saber emp\xEDrico e anal\xEDtico.`;
  }
  return `Essa \xE9 uma reflex\xE3o muito interessante! O di\xE1logo aberto e a curiosidade s\xE3o os verdadeiros motores do pensamento cr\xEDtico e da descoberta.`;
}
function determineUnilaAcademicDomain(searchSubject, lower, norm) {
  const text = `${searchSubject} ${lower} ${norm}`.toLowerCase();
  if (text.includes("comput") || text.includes("software") || text.includes("algoritm") || text.includes("dado") || text.includes("ia") || text.includes("inteligencia") || text.includes("fisic") || text.includes("matemat") || text.includes("quimic") || text.includes("engenhar") || text.includes("energ") || text.includes("solar") || text.includes("eletric") || text.includes("astron") || text.includes("espaco") || text.includes("telescop") || text.includes("robo") || text.includes("tecnol") || text.includes("mecanic") || text.includes("quantum")) {
    return {
      scientificPerspective: "Sob a perspectiva das ci\xEAncias exatas e engenharias, investiga-se esse dom\xEDnio atrav\xE9s de modelagem quantitativa, an\xE1lise de sistemas complexos, efici\xEAncia energ\xE9tica e desenvolvimento tecnol\xF3gico voltado a solu\xE7\xF5es emp\xEDricas sustent\xE1veis.",
      unilaConnection: "Na **UNILA**, esse campo conecta-se diretamente ao **ILATIT** (Instituto Latino-Americano de Tecnologia, Infraestrutura e Territ\xF3rio), com cursos de Engenharia F\xEDsica, Ci\xEAncia da Computa\xE7\xE3o, Engenharia de Energia e o prestigiado **PPGIES** (Programa de P\xF3s-Gradua\xE7\xE3o em Energia e Sustentabilidade). Em eventos institucionais como a **SIEPE** (Semana Integrada de Ensino, Pesquisa e Extens\xE3o) e por meio de editais de Inicia\xE7\xE3o Tecnol\xF3gica (**PIBITI/PRPPG**), estudantes e docentes desenvolvem pesquisas de ponta aplicadas \xE0 integra\xE7\xE3o regional."
    };
  }
  if (text.includes("saude") || text.includes("sa\xFAde") || text.includes("medicin") || text.includes("biolog") || text.includes("nutri") || text.includes("aliment") || text.includes("comida") || text.includes("bolo") || text.includes("fisiolog") || text.includes("corpo") || text.includes("cerebro") || text.includes("mente") || text.includes("sono") || text.includes("cansad") || text.includes("psicol") || text.includes("doenca") || text.includes("virus") || text.includes("vacina") || text.includes("cafe") || text.includes("caf\xE9")) {
    return {
      scientificPerspective: "Nas ci\xEAncias da vida e da sa\xFAde, as pesquisas analisam processos bioqu\xEDmicos, respostas fisiol\xF3gicas do organismo, epidemiologia preventiva e os determinantes socioambientais que influenciam o bem-estar e a qualidade de vida coletiva.",
      unilaConnection: "Na **UNILA**, esse eixo \xE9 liderado pelo **ILACVN** (Instituto Latino-Americano de Ci\xEAncias da Vida e da Natureza), integrando os cursos de Medicina, Sa\xFAde Coletiva e Biotecnologia. A universidade desenvolve projetos estrat\xE9gicos de sa\xFAde na regi\xE3o de Tr\xEDplice Fronteira (Brasil, Argentina e Paraguai), al\xE9m de debater sa\xFAde integral e perman\xEAncia acad\xEAmica com apoio da **PROAFE** e eventos discentes com bolsas **PIBIC**."
    };
  }
  if (text.includes("ambient") || text.includes("clima") || text.includes("ecolog") || text.includes("sustent") || text.includes("florest") || text.includes("bicho") || text.includes("animal") || text.includes("planta") || text.includes("agua") || text.includes("rio") || text.includes("parana") || text.includes("iguacu") || text.includes("biodivers") || text.includes("mata") || text.includes("pantanal") || text.includes("terra")) {
    return {
      scientificPerspective: "A ecologia contempor\xE2nea e as ci\xEAncias da terra investigam a resili\xEAncia de biomas, biogeoqu\xEDmica de bacias hidrogr\xE1ficas, mitiga\xE7\xE3o de mudan\xE7as clim\xE1ticas e conserva\xE7\xE3o da biodiversidade com foco em desenvolvimento sustent\xE1vel.",
      unilaConnection: "Esse tema \xE9 intr\xEDnseco \xE0 identidade da **UNILA**, sediada em Foz do Igua\xE7u junto ao Parque Nacional do Igua\xE7u e \xE0 Bacia do Rio Paran\xE1. Vincula-se ao **PPG em Biodiversidade Neotropical** e ao **PPGIES**, reunindo cientistas que pesquisam ecologia de fronteira, conserva\xE7\xE3o de recursos h\xEDdricos e transi\xE7\xE3o ecol\xF3gica justa na Am\xE9rica Latina."
    };
  }
  if (text.includes("futebol") || text.includes("esporte") || text.includes("polit") || text.includes("econom") || text.includes("social") || text.includes("socied") || text.includes("americ") || text.includes("latin") || text.includes("fronteir") || text.includes("histori") || text.includes("cultur") || text.includes("antropol") || text.includes("relaco") || text.includes("diplomac") || text.includes("trabalho") || text.includes("povo")) {
    return {
      scientificPerspective: "As ci\xEAncias humanas e sociais examinam as pr\xE1ticas culturais, identidades coletivas, din\xE2micas de poder e processos socioecon\xF4micos que moldam as sociedades contempor\xE2neas e a coopera\xE7\xE3o internacional.",
      unilaConnection: "Essa tem\xE1tica traduz o cerne da miss\xE3o da **UNILA**: promover a integra\xE7\xE3o cultural, cient\xEDfica e humana da Am\xE9rica Latina e do Caribe. Articula-se ao **ILAESP** (Instituto Latino-Americano de Economia, Sociedade e Pol\xEDtica) e ao **PPG-ICAL** (Integra\xE7\xE3o Contempor\xE2nea da Am\xE9rica Latina), promovendo col\xF3quios internacionais, observat\xF3rios de fronteira e debates sobre cidadania e integra\xE7\xE3o regional."
    };
  }
  if (text.includes("cinema") || text.includes("filme") || text.includes("audiovisual") || text.includes("music") || text.includes("arte") || text.includes("livro") || text.includes("literatur") || text.includes("poes") || text.includes("teatro") || text.includes("lingu") || text.includes("idioma") || text.includes("filosof")) {
    return {
      scientificPerspective: "Os estudos em est\xE9tica, semi\xF3tica e cr\xEDtica cultural investigam a linguagem como forma de express\xE3o humana, a po\xE9tica das narrativas visuais e sonoras e o papel da arte na descoloniza\xE7\xE3o do pensamento cr\xEDtico.",
      unilaConnection: "Na **UNILA**, essa frente \xE9 protagonista no **ILAACH** (Instituto Latino-Americano de Arte, Cultura e Hist\xF3ria), abrigando os aclamados cursos de Cinema e Audiovisual, Letras - Artes e Media\xE7\xE3o Cultural, M\xFAsica e Hist\xF3ria. O campus sedia mostras de cinema latino-americano, cineclubes universit\xE1rios e col\xF3quios que debatem est\xE9tica e diversidade cultural no continente."
    };
  }
  return {
    scientificPerspective: "Na epistemologia contempor\xE2nea, qualquer fen\xF4meno da experi\xEAncia humana pode ser investigado cientificamente atrav\xE9s de rigor metodol\xF3gico, revis\xE3o por pares e di\xE1logo interdisciplinar entre diferentes campos do saber.",
    unilaConnection: "A **UNILA** foi concebida sob uma proposta pedag\xF3gica e cient\xEDfica interdisciplinar que incentiva estudantes de toda a Am\xE9rica Latina a formularem perguntas inovadoras. Por meio de eventos como a **SIEPE** (Semana Integrada de Ensino, Pesquisa e Extens\xE3o da UNILA), do programa de Inicia\xE7\xE3o Cient\xEDfica (**PIBIC/PRPPG**) e de editais de apoio a eventos discentes (**PAPADE**), a universidade transforma a curiosidade acad\xEAmica em produ\xE7\xE3o de conhecimento relevante."
  };
}
function handleComponentHighlightEngine(lower) {
  const actions = [];
  if (lower.includes("idioma") || lower.includes("lingua") || lower.includes("l\xEDngua") || lower.includes("espanhol") || lower.includes("ingl\xEAs") || lower.includes("ingles") || lower.includes("portugu\xEAs") || lower.includes("portugues") || lower.includes("franc\xEAs") || lower.includes("frances")) {
    actions.push({
      type: "HIGHLIGHT_ELEMENT",
      payload: {
        elementId: "topbar-language-selector",
        title: "Seletor de Idioma da Interface",
        description: "Alterne rapidamente entre Portugu\xEAs, Espanhol, Ingl\xEAs e Franc\xEAs."
      }
    });
    return {
      text: "Destaquei o **Seletor de Idioma** no canto superior direito do cabe\xE7alho. Voc\xEA pode escolher entre Portugu\xEAs, Espanhol, Ingl\xEAs e Franc\xEAs, ou simplesmente me pedir: *'Sophia, mude o idioma para espanhol'*!",
      actions
    };
  }
  if (lower.includes("logo") || lower.includes("logotipo") || lower.includes("marca") || lower.includes("bras\xE3o") || lower.includes("brasao")) {
    actions.push({
      type: "HIGHLIGHT_ELEMENT",
      payload: {
        elementId: "unila-portal-logo-link",
        title: "Logotipo Oficial da UNILA",
        description: "S\xEDmbolo visual da Universidade Federal da Integra\xE7\xE3o Latino-Americana."
      }
    });
    return {
      text: "Destaquei o **Logotipo Oficial da UNILA** no cabe\xE7alho superior. Ele representa a identidade visual da nossa universidade e a integra\xE7\xE3o cient\xEDfica e cultural da Am\xE9rica Latina e Caribe.",
      actions
    };
  }
  if (lower.includes("t\xEDtulo") || lower.includes("titulo") || lower.includes("nome da plataforma") || lower.includes("nome do site")) {
    actions.push({
      type: "HIGHLIGHT_ELEMENT",
      payload: {
        elementId: "portal-title",
        title: "T\xEDtulo Oficial do Multirreposit\xF3rio",
        description: "Busca Acad\xEAmica Integrada da Universidade Federal da Integra\xE7\xE3o Latino-Americana."
      }
    });
    return {
      text: "Destaquei o **T\xEDtulo Oficial da Aplica\xE7\xE3o**: *UNILA Busca Acad\xEAmica Integrada*. A plataforma re\xFAne a colheita federada de 8 bases cient\xEDficas globais.",
      actions
    };
  }
  if (lower.includes("ordena") || lower.includes("classifica") || lower.includes("relev\xE2ncia") || lower.includes("relevancia") || lower.includes("mais citados") || lower.includes("mais recentes")) {
    actions.push({
      type: "HIGHLIGHT_ELEMENT",
      payload: {
        elementId: "sort-by-select",
        title: "Controle de Ordena\xE7\xE3o",
        description: "Classifique por Relev\xE2ncia, Mais Citados, Ano Decrescente ou T\xEDtulo A-Z."
      }
    });
    return {
      text: "Destaquei o seletor de **Ordena\xE7\xE3o dos Resultados** acima da lista de artigos. Voc\xEA pode ordenar por mais citados, ano recente/antigo ou relev\xE2ncia contextual.",
      actions
    };
  }
  if (lower.includes("resultado") || lower.includes("feed") || lower.includes("lista de artigo") || lower.includes("cards") || lower.includes("trabalhos")) {
    actions.push({
      type: "HIGHLIGHT_ELEMENT",
      payload: {
        elementId: "results-feed-column",
        title: "Listagem de Artigos Cient\xEDficos",
        description: "Coluna principal com todos os artigos recuperados pelas bases federadas."
      }
    });
    return {
      text: "Destaquei a **Coluna de Resultados** na p\xE1gina! Nela s\xE3o exibidos os artigos cient\xEDficos colhidos, com autores, ano, peri\xF3dicos, resumos, m\xE9tricas de cita\xE7\xE3o e bot\xF5es de PDF e cita\xE7\xE3o direta.",
      actions
    };
  }
  if (lower.includes("filtro de ano") || lower.includes("faixa de ano") || lower.includes("per\xEDodo de publica\xE7\xE3o") || lower.includes("periodo de publicacao")) {
    actions.push({
      type: "HIGHLIGHT_ELEMENT",
      payload: {
        elementId: "filter-section-years",
        title: "Filtro por Ano de Publica\xE7\xE3o",
        description: "Histograma e seletor de faixa temporal dos artigos cient\xEDficos."
      }
    });
    return {
      text: "Destaquei a se\xE7\xE3o de **Filtro de Anos** na barra lateral. Ela exibe a evolu\xE7\xE3o temporal e permite recortar a janela cronol\xF3gica dos trabalhos.",
      actions
    };
  }
  if (lower.includes("filtro de \xE1rea") || lower.includes("filtro de area") || lower.includes("\xE1reas do conhecimento") || lower.includes("areas do conhecimento") || lower.includes("cnpq")) {
    actions.push({
      type: "HIGHLIGHT_ELEMENT",
      payload: {
        elementId: "filter-section-fields",
        title: "Filtro por \xC1rea do Conhecimento",
        description: "Distribui\xE7\xE3o dos artigos por grandes \xE1reas cient\xEDficas e subdisciplinas."
      }
    });
    return {
      text: "Destaquei a se\xE7\xE3o de **\xC1reas do Conhecimento** nos filtros laterais. Aqui voc\xEA pode restringir a busca a campos espec\xEDficos, como Ci\xEAncias Exatas, Biol\xF3gicas, Humanas ou Engenharias.",
      actions
    };
  }
  if (lower.includes("filtro de autor") || lower.includes("autores mais") || lower.includes("pesquisador")) {
    actions.push({
      type: "HIGHLIGHT_ELEMENT",
      payload: {
        elementId: "filter-section-authors",
        title: "Filtro de Autores Frequentes",
        description: "Lista dos pesquisadores com maior n\xFAmero de publica\xE7\xF5es nesta busca."
      }
    });
    return {
      text: "Destaquei a se\xE7\xE3o de **Autores Frequentes** nos filtros laterais. Permite selecionar e filtrar diretamente os pesquisadores de maior produ\xE7\xE3o no t\xF3pico.",
      actions
    };
  }
  if (lower.includes("filtro de idioma") || lower.includes("idioma do artigo") || lower.includes("idioma dos artigos")) {
    actions.push({
      type: "HIGHLIGHT_ELEMENT",
      payload: {
        elementId: "filter-section-languages",
        title: "Filtro por Idioma dos Artigos",
        description: "Filtre publica\xE7\xF5es em Portugu\xEAs, Espanhol, Ingl\xEAs, Franc\xEAs, etc."
      }
    });
    return {
      text: "Destaquei a se\xE7\xE3o de **Idioma das Publica\xE7\xF5es** nos filtros laterais. Voc\xEA pode focar em produ\xE7\xF5es cient\xEDficas redigidas na l\xEDngua de sua prefer\xEAncia.",
      actions
    };
  }
  if (lower.includes("limpar filtro") || lower.includes("resetar filtro") || lower.includes("redefinir filtro")) {
    actions.push({
      type: "HIGHLIGHT_ELEMENT",
      payload: {
        elementId: "filter-clear-all-btn",
        title: "Bot\xE3o Limpar Todos os Filtros",
        description: "Redefine instantaneamente todos os filtros facetados ativos."
      }
    });
    actions.push({ type: "CLEAR_ALL_FILTERS" });
    return {
      text: "Destaquei o bot\xE3o **Limpar Filtros** e j\xE1 resetei todos os filtros para voc\xEA!",
      actions
    };
  }
  if (lower.includes("acesso aberto") || lower.includes("open access") || lower.includes("oa") || lower.includes("gratuito") || lower.includes("sem paywall")) {
    actions.push({
      type: "HIGHLIGHT_ELEMENT",
      payload: {
        elementId: "open-access-toggle-btn",
        title: "Filtro de Acesso Aberto (OA)",
        description: "Clique neste bot\xE3o para filtrar exclusivamente artigos com licen\xE7a livre e sem cobran\xE7a de taxa."
      }
    });
    actions.push({ type: "SET_OPEN_ACCESS", payload: { value: true } });
    return {
      text: "Destaquei o filtro de **Acesso Aberto (Open Access)** na interface. Ao ativ\xE1-lo, o sistema filtra exclusivamente artigos de peri\xF3dicos livres de paywall (vias Dourada, Verde, H\xEDbrida e Bronze). J\xE1 deixei ativado para sua pr\xF3xima consulta!",
      actions
    };
  }
  if (lower.includes("pdf") || lower.includes("baixar") || lower.includes("download") || lower.includes("texto completo")) {
    actions.push({
      type: "HIGHLIGHT_ELEMENT",
      payload: {
        elementId: "pdf-only-toggle-btn",
        title: "Filtro Com PDF Direto",
        description: "Exibe exclusivamente publica\xE7\xF5es com link direto verificado para leitura e download de PDF."
      }
    });
    actions.push({ type: "SET_HAS_PDF", payload: { value: true } });
    return {
      text: "Destaquei o seletor **Com PDF Direto**. Ele garante que voc\xEA visualize apenas artigos que possuem o arquivo PDF \xEDntegro acess\xEDvel para download imediato ou leitura no visualizador embutido da aplica\xE7\xE3o.",
      actions
    };
  }
  if (lower.includes("salvo") || lower.includes("favorito") || lower.includes("cole\xE7\xE3o") || lower.includes("guardar") || lower.includes("bibtex") || lower.includes("ris")) {
    actions.push({
      type: "HIGHLIGHT_ELEMENT",
      payload: {
        elementId: "saved-articles-btn",
        title: "Cole\xE7\xE3o de Artigos Salvos",
        description: "Acesse suas refer\xEAncias favoritadas e exporte em BibTeX ou RIS para Zotero e Mendeley."
      }
    });
    actions.push({ type: "OPEN_SAVED" });
    return {
      text: "Destaquei o bot\xE3o **Cole\xE7\xE3o Salva** no cabe\xE7alho e abri o painel de favoritos. L\xE1 ficam guardados todos os artigos que voc\xEA marcou com a estrela ou marcador, permitindo exportar a bibliografia em lote nos formatos BibTeX e RIS.",
      actions
    };
  }
  if (lower.includes("sugest") || lower.includes("tema sugerido") || lower.includes("topico sugerido") || lower.includes("chips")) {
    actions.push({
      type: "HIGHLIGHT_ELEMENT",
      payload: {
        elementId: "search-suggestions-chips",
        title: "Campo de Sugest\xF5es de Pesquisa",
        description: "Aqui est\xE3o sugest\xF5es r\xE1pidas de temas cient\xEDficos e palavras-chave populares. Clicar em qualquer etiqueta inicia a busca imediatamente.",
        contextNote: "Dica da Sophia: Voc\xEA pode rolar a barra de sugest\xF5es horizontalmente para ver mais temas, ou me pedir temas personalizados para seu TCC!",
        quickPrompts: ["Sugerir temas para TCC em Intelig\xEAncia Artificial", "Como funcionam os t\xF3picos sugeridos?"]
      }
    });
    return {
      text: "Destaquei o **Campo de Sugest\xF5es de Pesquisa** logo abaixo da barra de busca! Essas etiquetas permitem explorar temas cient\xEDficos rapidamente com um clique.",
      actions
    };
  }
  if (lower.includes("seletor de idioma") || lower.includes("seletor de idiomas") || lower.includes("mudar idioma") || lower.includes("trocar idioma") || lower.includes("idioma da pagina") || lower.includes("idioma do sistema") || lower.includes("idioma") && (lower.includes("onde") || lower.includes("como") || lower.includes("destac"))) {
    actions.push({
      type: "HIGHLIGHT_ELEMENT",
      payload: {
        elementId: "topbar-language-selector",
        title: "Seletor de Idiomas da Plataforma",
        description: "Alterne a interface completa entre Portugu\xEAs, Espanhol, Ingl\xEAs e Franc\xEAs com um clique, refletindo a voca\xE7\xE3o internacional e integracionista da UNILA.",
        contextNote: "Dica da Sophia: O seletor traduz todos os menus, bot\xF5es e mensagens do sistema instantaneamente.",
        quickPrompts: ["Mudar idioma para Espanhol", "Mudar idioma para Ingl\xEAs", "Como funciona o suporte multil\xEDngue?"]
      }
    });
    return {
      text: "Destaquei o **Seletor de Idiomas** no canto superior direito do cabe\xE7alho. Voc\xEA pode alternar entre Portugu\xEAs, Espanhol, Ingl\xEAs e Franc\xEAs a qualquer momento.",
      actions
    };
  }
  if (lower.includes("openalex")) {
    actions.push({
      type: "HIGHLIGHT_ELEMENT",
      payload: {
        elementId: "repository-item-openalex",
        title: "Reposit\xF3rio OpenAlex Integrado",
        description: "O OpenAlex indexa mais de 250 milh\xF5es de obras cient\xEDficas mundiais com metadados abertos, cita\xE7\xF5es e afilia\xE7\xF5es institucionais.",
        contextNote: "Dica da Sophia: O OpenAlex \xE9 excelente para literatura contempor\xE2nea e m\xE9tricas de cita\xE7\xE3o.",
        quickPrompts: ["Buscar artigos no OpenAlex", "O que \xE9 o OpenAlex?"]
      }
    });
    return { text: "Destaquei o reposit\xF3rio **OpenAlex** na interface para voc\xEA!", actions };
  }
  if (lower.includes("crossref")) {
    actions.push({
      type: "HIGHLIGHT_ELEMENT",
      payload: {
        elementId: "repository-item-crossref",
        title: "Ag\xEAncia de Registro Crossref (DOI)",
        description: "A Crossref fornece os metadados oficiais de registros DOI de peri\xF3dicos, livros e anais de confer\xEAncias internacionais.",
        contextNote: "Dica da Sophia: Excelente para busca por DOI exato e confer\xEAncia de metadados de grandes editoras.",
        quickPrompts: ["Como pesquisar por DOI?", "O que \xE9 a Crossref?"]
      }
    });
    return { text: "Destaquei o reposit\xF3rio **Crossref** na interface!", actions };
  }
  if (lower.includes("arxiv")) {
    actions.push({
      type: "HIGHLIGHT_ELEMENT",
      payload: {
        elementId: "repository-item-arxiv",
        title: "Reposit\xF3rio de Preprints arXiv (Cornell)",
        description: "O arXiv re\xFAne preprints pioneiros em F\xEDsica, Computa\xE7\xE3o, Matem\xE1tica, Biologia Quantitativa e Finan\xE7as.",
        contextNote: "Dica da Sophia: Perfeito para acessar descobertas de ponta antes mesmo da publica\xE7\xE3o formal em peri\xF3dico.",
        quickPrompts: ["Buscar preprints no arXiv", "Como citar artigos do arXiv?"]
      }
    });
    return { text: "Destaquei o reposit\xF3rio **arXiv** na interface!", actions };
  }
  if (lower.includes("capes") || lower.includes("periodicos")) {
    actions.push({
      type: "HIGHLIGHT_ELEMENT",
      payload: {
        elementId: "repository-item-portalcapes",
        title: "Portal de Peri\xF3dicos CAPES",
        description: "Acesso \xE0 produ\xE7\xE3o cient\xEDfica nacional e internacional com suporte ao acervo disponibilizado \xE0 comunidade acad\xEAmica brasileira.",
        contextNote: "Dica da Sophia: Integra peri\xF3dicos nacionais e latino-americanos de alta relev\xE2ncia acad\xEAmica.",
        quickPrompts: ["Como funciona o acervo CAPES?", "Filtrar publica\xE7\xF5es CAPES"]
      }
    });
    return { text: "Destaquei o **Portal de Peri\xF3dicos CAPES** na interface!", actions };
  }
  if (lower.includes("core")) {
    actions.push({
      type: "HIGHLIGHT_ELEMENT",
      payload: {
        elementId: "repository-item-core",
        title: "Agregador Global CORE",
        description: "O CORE agrega milh\xF5es de publica\xE7\xF5es de acesso aberto diretamente de reposit\xF3rios institucionais e bibliotecas digitais do mundo todo.",
        contextNote: "Dica da Sophia: O CORE tem alta taxa de PDFs integrais gratuitos dispon\xEDveis.",
        quickPrompts: ["Buscar publica\xE7\xF5es no CORE", "O que \xE9 o CORE?"]
      }
    });
    return { text: "Destaquei o agregador **CORE** na interface!", actions };
  }
  if (lower.includes("doaj")) {
    actions.push({
      type: "HIGHLIGHT_ELEMENT",
      payload: {
        elementId: "repository-item-doaj",
        title: "Directory of Open Access Journals (DOAJ)",
        description: "Diret\xF3rio independente que indexa peri\xF3dicos de acesso aberto revisados por pares com elevados padr\xF5es de qualidade cient\xEDfica.",
        contextNote: "Dica da Sophia: Todos os peri\xF3dicos no DOAJ s\xE3o 100% de acesso aberto sem paywall.",
        quickPrompts: ["Buscar no DOAJ", "Crit\xE9rios de qualidade do DOAJ"]
      }
    });
    return { text: "Destaquei o **DOAJ** na interface!", actions };
  }
  if (lower.includes("semanticscholar") || lower.includes("semantic scholar")) {
    actions.push({
      type: "HIGHLIGHT_ELEMENT",
      payload: {
        elementId: "repository-item-semanticscholar",
        title: "Semantic Scholar (Allen AI)",
        description: "Motor de busca acad\xEAmico com intelig\xEAncia artificial para extrair t\xF3picos influentes, cita\xE7\xF5es sem\xE2nticas e grafos de pesquisadores.",
        contextNote: "Dica da Sophia: O Semantic Scholar identifica cita\xE7\xF5es que realmente influenciaram a metodologia do estudo.",
        quickPrompts: ["O que s\xE3o cita\xE7\xF5es influentes?", "Buscar no Semantic Scholar"]
      }
    });
    return { text: "Destaquei o **Semantic Scholar** na interface!", actions };
  }
  if (lower.includes("europepmc") || lower.includes("europe pmc")) {
    actions.push({
      type: "HIGHLIGHT_ELEMENT",
      payload: {
        elementId: "repository-item-europepmc",
        title: "Europe PMC (Life Sciences)",
        description: "Base de dados aberta l\xEDder para pesquisa em ci\xEAncias da vida, biomedicina, biologia e sa\xFAde p\xFAblica mundial.",
        contextNote: "Dica da Sophia: Altamente recomendado para artigos m\xE9dicos e biol\xF3gicos com texto completo.",
        quickPrompts: ["Buscar na Europe PMC", "Como encontrar ensaios cl\xEDnicos?"]
      }
    });
    return { text: "Destaquei o reposit\xF3rio **Europe PMC** na interface!", actions };
  }
  if (lower.includes("barra de busca") || lower.includes("barra de pesquisa") || lower.includes("campo de pesquisa") || lower.includes("campo de busca") || lower.includes("onde digito") || lower.includes("onde pesquiso") || lower.includes("onde buscar")) {
    actions.push({
      type: "HIGHLIGHT_ELEMENT",
      payload: {
        elementId: "search-bar-input",
        title: "Barra de Pesquisa Acad\xEAmica",
        description: "Digite qualquer termo cient\xEDfico, t\xF3pico de pesquisa, nome de autor ou c\xF3digo DOI.",
        contextNote: 'Dica da Sophia: Voc\xEA pode usar aspas para termos exatos ("intelig\xEAncia artificial") ou operadores AND e OR.',
        quickPrompts: ["Como fazer busca avan\xE7ada?", "Como pesquisar por DOI?"]
      }
    });
    return {
      text: "Destaquei a **Barra de Pesquisa Acad\xEAmica**. Voc\xEA pode digitar temas de pesquisa, operadores booleanos (AND, OR), nomes de autores ou c\xF3digos DOI. Pressione Enter ou clique na lupa para iniciar a colheita federada nas 8 bases.",
      actions
    };
  }
  const normLower = normalizeText(lower);
  if (normLower.includes("base") || normLower.includes("repositorio") || normLower.includes("fonte") || normLower.includes("banco")) {
    actions.push({
      type: "HIGHLIGHT_ELEMENT",
      payload: {
        elementId: "repository-selectors-bar",
        title: "Bases Acad\xEAmicas Integradas (8 Fontes)",
        description: "Selecione e combine as 8 bases acad\xEAmicas conectadas: Portal de Peri\xF3dicos CAPES, OpenAlex, arXiv, Crossref, CORE, DOAJ, Europe PMC e Semantic Scholar.",
        contextNote: "Dica da Sophia: Voc\xEA pode desmarcar qualquer base para focar apenas nas que interessam \xE0 sua \xE1rea espec\xEDfica.",
        quickPrompts: ["Quais as 8 bases conectadas?", "Como selecionar apenas bases com PDF direto?"]
      }
    });
    return {
      text: "Destaquei a barra de **Bases a Consultar** logo abaixo do campo de busca. Nela voc\xEA pode clicar para ligar ou desligar qualquer reposit\xF3rio acad\xEAmico (OpenAlex, arXiv, Crossref, Portal CAPES, DOAJ, Europe PMC, Semantic Scholar e CORE) conforme as necessidades de sua pesquisa.",
      actions
    };
  }
  if (lower.includes("filtro") || lower.includes("lateral") || lower.includes("ano") || lower.includes("autor") || lower.includes("\xE1rea") || lower.includes("faceta")) {
    actions.push({
      type: "HIGHLIGHT_ELEMENT",
      payload: {
        elementId: "desktop-filter-sidebar",
        title: "Filtros Facetados",
        description: "Refine os resultados por faixa de anos, autores frequentes, \xE1reas do conhecimento e peri\xF3dicos."
      }
    });
    return {
      text: "Destaquei a **Barra Lateral de Filtros Facetados** \xE0 esquerda. Ela exibe a distribui\xE7\xE3o quantitativa dos artigos encontrados por ano de publica\xE7\xE3o, autores com mais publica\xE7\xF5es, \xE1reas do conhecimento e peri\xF3dicos acad\xEAmicos.",
      actions
    };
  }
  if (lower.includes("sem\xE2ntic") || lower.includes("semantica") || lower.includes("vetorial") || lower.includes("modo sem\xE2ntico")) {
    actions.push({
      type: "HIGHLIGHT_ELEMENT",
      payload: {
        elementId: "semantic-toggle-btn",
        title: "Modo de Busca Sem\xE2ntica IA",
        description: "Combina palavras-chave exatas com busca vetorial contextual."
      }
    });
    actions.push({ type: "SET_SEMANTIC_MODE", payload: { value: true } });
    return {
      text: "Destaquei o bot\xE3o de **Busca Sem\xE2ntica IA**. Quando ativo, o motor do Multirreposit\xF3rio n\xE3o se limita a termos literais: ele expande sin\xF4nimos conceituais e faz ranqueamento por similaridade contextual.",
      actions
    };
  }
  if (lower.includes("portal") || lower.includes("institucional") || lower.includes("site da unila") || lower.includes("onde fica o edital")) {
    actions.push({
      type: "HIGHLIGHT_ELEMENT",
      payload: {
        elementId: "institutional-horizontal-nav",
        title: "Navega\xE7\xE3o Institucional UNILA",
        description: "Acesso direto ao Portal UNILA, Editais Oficiais e Biblioteca Latino-Americana."
      }
    });
    return {
      text: "Destaquei a barra de **Navega\xE7\xE3o Institucional UNILA** no topo superior da aplica\xE7\xE3o. Ela cont\xE9m atalhos oficiais diretos para o Portal Institucional da UNILA (https://portal.unila.edu.br/), o Portal de Editais e a Biblioteca Latino-Americana.",
      actions
    };
  }
  actions.push({
    type: "HIGHLIGHT_ELEMENT",
    payload: {
      elementId: "search-bar-input",
      title: "Explorar Recursos da Plataforma",
      description: "Barra central para busca cient\xEDfica integrada da UNILA."
    }
  });
  return {
    text: "Destaquei a \xE1rea principal de pesquisa. Se voc\xEA deseja encontrar um elemento espec\xEDfico, pergunte: *'onde fica o filtro de acesso aberto?'*, *'onde vejo os artigos salvos?'*, *'como baixar PDFs?'* ou *'onde seleciono as bases acad\xEAmicas?'*.",
    actions
  };
}
function extractSearchKeywords(text, stopWords) {
  const words = text.replace(/[^\w\s-]/g, " ").split(/\s+/).filter((w) => w.length > 2 && !stopWords.includes(w.toLowerCase()));
  return words.slice(0, 4).join(" ");
}
function extractCleanAcademicQuery(prompt) {
  const removePatterns = [
    /^(busque|buscar|busca|pesquise|pesquisar|pesquisa|procure|procurar|procura|encontre|ache|mostre|exiba)\s+(artigos?\s+(sobre|de|do|da)?|papers?\s+(sobre|de|do|da)?|estudos?\s+(sobre|de|do|da)?)/i,
    /^(artigos?\s+(sobre|de|do|da)?)/i,
    /^(papers?\s+(sobre|de|do|da)?)/i,
    /^(estudos?\s+(sobre|de|do|da)?)/i,
    /^(quero\s+ver\s+artigos?\s+(sobre|de|do|da)?)/i,
    /^(quais\s+(são\s+os\s+)?artigos?\s+(sobre|de|do|da)?)/i,
    /^(busque|buscar|busca|pesquise|pesquisar|pesquisa|procure|procurar|procura)\s+(por\s+)?/i,
    /\b(no\s+chat|aqui\s+no\s+chat|por\s+favor|pra\s+mim)\b/gi
  ];
  let cleaned = prompt.trim();
  for (const pat of removePatterns) {
    cleaned = cleaned.replace(pat, "").trim();
  }
  return cleaned.replace(/[?.!]+$/, "").trim();
}
function normalizeText(text) {
  return (text || "").toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "").replace(/[^\w\s]/gi, " ").replace(/\s+/g, " ").trim();
}

// server.ts
async function startServer() {
  const app = (0, import_express.default)();
  const PORT = 3e3;
  app.use((req, res, next) => {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Methods", "GET, POST, OPTIONS, PUT, DELETE");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept, Authorization");
    if (req.method === "OPTIONS") {
      return res.sendStatus(200);
    }
    next();
  });
  app.use(import_express.default.json({ limit: "25mb" }));
  app.get("/api/health", (_req, res) => {
    res.json({ status: "ok", timestamp: (/* @__PURE__ */ new Date()).toISOString() });
  });
  app.post("/api/copilot", async (req, res) => {
    try {
      const { messages, pageContext } = req.body;
      if (!messages || !Array.isArray(messages)) {
        return res.status(400).json({ error: "Par\xE2metro 'messages' \xE9 obrigat\xF3rio e deve ser uma lista." });
      }
      const result = await handleCopilotChat({ messages, pageContext });
      res.json(result);
    } catch (error) {
      console.error("Copilot API error:", error);
      res.status(500).json({
        text: "Desculpe, ocorreu um erro ao processar sua solicita\xE7\xE3o no co-pilot. Por favor, tente novamente.",
        error: error?.message
      });
    }
  });
  app.get("/api/unila/editais", async (req, res) => {
    try {
      const q = (req.query.q || "").trim();
      const cat = (req.query.category || "").trim();
      const limit = parseInt(req.query.limit || "10", 10);
      const editais = await fetchUnilaEditais(q, cat, limit);
      res.json({ editais, count: editais.length, source: "https://documentos.unila.edu.br" });
    } catch (err) {
      console.error("Unila Editais API error:", err);
      res.status(500).json({ error: "Falha ao recuperar editais", message: err?.message });
    }
  });
  app.get("/api/unila/news", async (req, res) => {
    try {
      const q = (req.query.q || "").trim();
      const limit = parseInt(req.query.limit || "6", 10);
      const news = await fetchUnilaNews(q, limit);
      res.json({ news, count: news.length, source: "https://portal.unila.edu.br/noticias" });
    } catch (err) {
      console.error("Unila News API error:", err);
      res.status(500).json({ error: "Falha ao recuperar not\xEDcias", message: err?.message });
    }
  });
  app.get("/api/pdf-proxy", async (req, res) => {
    const targetUrl = req.query.url;
    if (!targetUrl || !targetUrl.startsWith("http")) {
      return res.status(400).send("URL de PDF inv\xE1lida");
    }
    try {
      const upstreamRes = await fetch(targetUrl, {
        headers: {
          "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.0.0 Safari/537.36",
          "Accept": "application/pdf,application/octet-stream,*/*"
        },
        redirect: "follow",
        signal: AbortSignal.timeout(2e4)
      });
      if (!upstreamRes.ok) {
        return res.status(upstreamRes.status).send(`Falha ao recuperar PDF da fonte externa: HTTP ${upstreamRes.status}`);
      }
      const contentType = upstreamRes.headers.get("content-type") || "application/pdf";
      res.setHeader("Content-Type", contentType.includes("pdf") ? "application/pdf" : contentType);
      res.setHeader("Content-Disposition", 'inline; filename="artigo.pdf"');
      res.setHeader("Access-Control-Allow-Origin", "*");
      res.removeHeader("X-Frame-Options");
      res.removeHeader("Content-Security-Policy");
      const arrayBuffer = await upstreamRes.arrayBuffer();
      res.send(Buffer.from(arrayBuffer));
    } catch (err) {
      console.warn("PDF proxy error for URL:", targetUrl, err?.message);
      res.status(502).send("N\xE3o foi poss\xEDvel carregar o PDF diretamente: " + (err?.message || "Timeout na conex\xE3o"));
    }
  });
  app.get("/api/search", async (req, res) => {
    try {
      const query = (req.query.q || "").trim();
      const sourcesParam = req.query.sources;
      const semanticParam = req.query.semantic === "true";
      let selectedSources = [
        "Portal CAPES",
        "Semantic Scholar",
        "OpenAlex",
        "Crossref",
        "CORE",
        "Europe PMC",
        "arXiv",
        "DOAJ"
      ];
      if (sourcesParam) {
        const parsed = sourcesParam.split(",").map((s) => s.trim());
        if (parsed.length > 0) {
          selectedSources = parsed;
        }
      }
      const startTime = Date.now();
      const searchQuery = query || "intelig\xEAncia artificial";
      const result = await executeFederatedSearch(
        searchQuery,
        selectedSources,
        semanticParam
      );
      const executionTimeMs = Date.now() - startTime;
      res.json({
        query: searchQuery,
        totalFound: result.totalFound,
        deduplicatedCount: result.deduplicatedCount,
        executionTimeMs,
        sourcesStatus: result.sourcesStatus,
        articles: result.articles,
        facets: result.facets
      });
    } catch (error) {
      console.error("Search error:", error);
      res.status(500).json({
        error: "Falha ao processar busca",
        message: error?.message || "Erro interno"
      });
    }
  });
  app.use(import_express.default.static(import_path.default.join(process.cwd(), "public")));
  app.use("/images", import_express.default.static(import_path.default.join(process.cwd(), "images")));
  if (process.env.NODE_ENV !== "production") {
    const vite = await (0, import_vite.createServer)({
      server: { middlewareMode: true },
      appType: "spa"
    });
    app.use(vite.middlewares);
  } else {
    const distPath = import_path.default.join(process.cwd(), "dist");
    app.use(import_express.default.static(distPath));
    app.get("*", (_req, res) => {
      res.sendFile(import_path.default.join(distPath, "index.html"));
    });
  }
  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Federated Academic Search running on http://localhost:${PORT}`);
  });
}
startServer();
//# sourceMappingURL=server.cjs.map
