// Ghana Universities with their campuses
export const ghanaUniversities = {
  'University of Ghana': ['Legon Campus', 'City Campus', 'Accra City Campus'],
  'Kwame Nkrumah University of Science and Technology': ['Kumasi Campus', 'Accra Campus'],
  'University of Cape Coast': ['Main Campus', 'City Campus'],
  'University of Education, Winneba': ['Winneba Campus', 'Kumasi Campus', 'Mampong Campus', 'Asante Mampong Campus'],
  'University for Development Studies': ['Tamale Campus', 'Navrongo Campus', 'Wa Campus', 'Nyankpala Campus'],
  'Ashesi University': ['Berekuso Campus'],
  'Central University': ['Miotso Campus', 'Kumasi Campus'],
  'University of Professional Studies, Accra': ['Main Campus', 'Accra Campus'],
  'Ghana Technology University College': ['Tesano Campus', 'Kumasi Campus'],
  'Ghana Institute of Management and Public Administration': ['Achimota Campus', 'Greenhill Campus'],
  'Presbyterian University College': ['Abetifi Campus', 'Asante Akyem Campus', 'Tema Campus'],
  'Valley View University': ['Techiman Campus', 'Kumasi Campus', 'Accra Campus'],
  'Regent University College': ['Accra Campus'],
  'Wisconsin International University College': ['Accra Campus', 'Kumasi Campus'],
  'Methodist University College': ['Dansoman Campus', 'Tema Campus', 'Wenchi Campus'],
  'Catholic University College': ['Fiapre Campus', 'Sunyani Campus'],
  'Islamic University College': ['East Legon Campus'],
  'Pentecost University College': ['Sowutuom Campus'],
  'Accra Institute of Technology': ['Accra Campus'],
  'BlueCrest University College': ['Accra Campus'],
  'Garden City University College': ['Kenyasi Campus', 'Kumasi Campus'],
  'Kings University College': ['Accra Campus'],
  'Knutsford University College': ['East Legon Campus'],
  'Lancaster University Ghana': ['Accra Campus'],
  'Maranatha University College': ['Accra Campus'],
  'MountCrest University College': ['Accra Campus'],
  'Radford University College': ['Accra Campus', 'Kumasi Campus'],
  'Sunyani Technical University': ['Main Campus'],
  'Takoradi Technical University': ['Main Campus'],
  'Tamale Technical University': ['Main Campus'],
  'Koforidua Technical University': ['Main Campus'],
  'Ho Technical University': ['Main Campus'],
  'Cape Coast Technical University': ['Main Campus'],
  'Accra Technical University': ['Main Campus'],
  'Kumasi Technical University': ['Main Campus'],
  'Wa Technical University': ['Main Campus'],
  'Bolgatanga Technical University': ['Main Campus']
};

export const getCampuses = (university) => {
  return ghanaUniversities[university] || [];
};

export const getAllUniversities = () => {
  return Object.keys(ghanaUniversities);
};

