import { ref } from "vue";

export const PieOptions = ref({
  title: {
    text: '',
    left: 'center',
  },
  tooltip: {
    trigger: 'item',
  },
  legend: {
    orient: 'vertical',
    left: 'left',
  },
  series: [
    {
      name: '',
      type: 'pie',
      radius: '50%',
      data: [],
      emphasis: {
        itemStyle: {
          shadowBlur: 10,
          shadowOffsetX: 0,
          shadowColor: 'rgba(0, 0, 0, 0.5)',
        },
      },
    },
  ],
});

export const userAttributes = ref({
  ages: [],
  bloodTypes: [],
  departments: [],
  educationLevels: [],
  genders: [],
  hobbies: [],
  mediaSources: [],
  majors: [],
  occupations: [],
  personalities: [],
  positions: [],
});

export const parseUserData = (data) => {
  const attributes = {
    ages: [],
    bloodTypes: [],
    departments: [],
    educationLevels: [],
    genders: [],
    hobbies: [],
    mediaSources: [],
    majors: [],
    occupations: [],
    personalities: [],
    positions: [],
  };

  data.forEach(item => {
    if (item.Age) attributes.ages.push(item.Age);
    if (item["Blood type"]) attributes.bloodTypes.push(item["Blood type"]);
    if (item.Department) attributes.departments.push(...item.Department.split('|'));
    if (item["Educational background (Highest education)"]) attributes.educationLevels.push(item["Educational background (Highest education)"]);
    if (item.Gender) attributes.genders.push(item.Gender);
    if (item.Hobbies) attributes.hobbies.push(...item.Hobbies.split('|'));
    if (item["Information gathering media"]) attributes.mediaSources.push(...item["Information gathering media"].split('|'));
    if (item["Major/Field of study"]) attributes.majors.push(item["Major/Field of study"]);
    if (item.Occupation) attributes.occupations.push(...item.Occupation.split('|'));
    if (item.Personality) attributes.personalities.push(...item.Personality.split('|'));
    if (item["Position (job title)"]) attributes.positions.push(item["Position (job title)"]);
  });

  userAttributes.value = attributes;
  console.log("Parsed user attributes:", userAttributes.value); // 调试输出
};
