
export function convertToText(inputData) {
  let outputData = {};

  for (const category of inputData) {
      const categoryName = category.label;
      const categoryItems = [];

      for (const item of category.children) {
          categoryItems.push(item.label);
      }

      outputData[categoryName] = categoryItems;
  }

  return outputData;
}

export function convertToTags(inputData) {
  let outputData = [];
  let counter = 1;

  for (const key in inputData) {
      const category = {
          label: key,
          value: counter.toString(),
          children: []
      };

      const items = inputData[key];
      for (const item of items) {
          category.children.push({
              label: item,
              value: item
          });
      }

      outputData.push(category);
      counter++;
  }

  return outputData;
}

export function convertToString(groupedTags) {
  let result = '';

  groupedTags.forEach(group => {
    result += group.label + '\n';
    group.children.forEach(child => {
      result += child.label + '\n';
    });
    result += '\n';
  });

  return result.trim(); // Remove trailing newline
}

export function splitLines(str) {
  // Split the string by newlines
  const lines = str.split(/\r?\n/);
  const result = [];

  let addAsterisk = false;

  // Loop through each line
  for (let i = 0; i < lines.length; i++) {
    const line = lines[i].trim();

    // Check if the line is not empty
    if (line !== '') {
      // If the previous line was empty or it's the first line, append '*' to it
      if (addAsterisk) {
        result.push(line + '*');
        addAsterisk = false;
      } else {
        result.push(line);
      }
    } else {
      // Set flag to add '*' to the next non-empty line
      addAsterisk = true;
    }
  }

  return result;
}

export const convertStringToGroupedTags = (input) => {
  const lines = input.split(/\n\s*\n/);
  let value = 1;
  const result = [];
  
  lines.forEach((line, index) => {
    const lineItems = line.split('\n').filter(item => item.trim() !== '');
    if (lineItems.length > 0) {
      const parentLabel = lineItems.shift();
      const parentValue = value.toString();
      value++;
      const children = lineItems.map(child => ({
        label: child.trim(),
        value: child.trim(),
      }));
      result.push({
        label: parentLabel.trim(),
        value: parentValue,
        children,
      });
    }
  });

  console.log(result);
  return result;
  
};


export const groupedTags = [
    {
      label: 'Achievement Key',
      value: '1',
      children: [
        {
          label: 'Achieved Independently',
          value: 'Achieved Independently',
        },
        {
          label: 'Achieved with Decreasing Support',
          value: 'Achieved with Decreasing Support',
        },
        {
          label: 'Achieved with Support',
          value: 'Achieved with Support',
        },
        {
          label: 'Generalized',
          value: 'Generalized',
        },
        {
          label: 'Not Achieved',
          value: 'Not Achieved',
        },
      ],
    },
    {
      label: 'Default',
      value: '2',
      children: [
        {
          label: 'Experience',
          value: 'Experience',
        },
        {
          label: 'IEP Goals',
          value: 'IEP Goals',
        },
        {
          label: 'Independent Work System',
          value: 'Independent Work System',
        },
        {
          label: 'Magic Moment',
          value: 'Magic Moment',
        },
        {
          label: 'Rangi',
          value: 'Rangi',
        },
        {
          label: 'Technology',
          value: 'Technology',
        },
        {
          label: 'Visual Art',
          value: 'Visual Art',
        },
      ],
    },
    {
      label: 'Health NZC',
      value: '3',
      children: [
        {
          label: 'A1 Personal growth and development • Describe feelings and ask questions about their health, growth, development, and personal needs and wants.',
          value: 'A1 Personal growth and development • Describe feelings and ask questions about their health, growth, development, and personal needs and wants.',
        },
        {
          label: 'A2 Regular physical activity • Participate in creative and regular physical activities and identify enjoyable experiences.',
          value: 'A2 Regular physical activity • Participate in creative and regular physical activities and identify enjoyable experiences.',
        },
        {
          label: 'A3 Safety management • Describe and use safe practices in a range of contexts and identify people who can help.',
          value: 'IA3 Safety management • Describe and use safe practices in a range of contexts and identify people who can help.',
        },
        {
          label: 'A4 Personal identity • Describe themselves in relation to a range of contexts',
          value: 'A4 Personal identity • Describe themselves in relation to a range of contexts',
        },
        {
          label: 'B1 Movement skills; B3 Science and technology • Develop a wide range of movement skills, using a variety of equipment and play environments.',
          value: 'B1 Movement skills; B3 Science and technology • Develop a wide range of movement skills, using a variety of equipment and play environments.',
        },
        {
          label: 'B2 Positive attitudes; B4 Challenges and social and cultural factors • Participate in a range of games and activities and identify the factors that make participation safe and enjoyable.',
          value: 'B2 Positive attitudes; B4 Challenges and social and cultural factors • Participate in a range of games and activities and identify the factors that make participation safe and enjoyable.',
        },
        {
          label: 'C1 Relationships • Explore and share ideas about relationships with other people',
          value: 'C1 Relationships • Explore and share ideas about relationships with other people',
        },
        {
          label: 'C2 Identity, sensitivity, and respect • Demonstrate respect through sharing and co-operation in groups.',
          value: 'C2 Identity, sensitivity, and respect • Demonstrate respect through sharing and co-operation in groups.',
        },
        {
          label: 'C3 Interpersonal skills • Express their own ideas, needs, wants, and feelings clearly and listen to those of other people.',
          value: 'C3 Interpersonal skills • Express their own ideas, needs, wants, and feelings clearly and listen to those of other people.',
        },
        {
          label: 'D2 Community resources • Identify and discuss obvious hazards in their home, school, and local environment and adopt simple safety practices.',
          value: 'D2 Community resources • Identify and discuss obvious hazards in their home, school, and local environment and adopt simple safety practices.',
        },
        {
          label: 'D3 Rights, responsibilities, and laws; D4 People and the environment • Take individual and collective action to contribute to environments that can be enjoyed by all.',
          value: 'D3 Rights, responsibilities, and laws; D4 People and the environment • Take individual and collective action to contribute to environments that can be enjoyed by all.',
        },
      ],
    },
    {
      label: 'Ngā Uara/Our values',
      value: '4',
      children: [
        {
          label: '• Kaitiakitanga - Protect and uphold the rights, needs and aspirations of our akonga (learners)',
          value: '• Kaitiakitanga - Protect and uphold the rights, needs and aspirations of our akonga (learners)',
        },
        {
          label: '• Kotahitanga - Unity in everything we do',
          value: '• Kotahitanga - Unity in everything we do',
        },
        {
          label: '• Manaakitanga - Support and enhance the Hauora (wellbeing) of our âkonga(learners)',
          value: '• Manaakitanga - Support and enhance the Hauora (wellbeing) of our âkonga(learners)',
        },
        {
          label: '• Whanaungatanga - Develop and nurture relationships within our school and community.',
          value: '• Whanaungatanga - Develop and nurture relationships within our school and community.',
        },
      ],
    },
  ];