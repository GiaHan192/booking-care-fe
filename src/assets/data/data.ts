interface Answer {
  answer: string
  point: number
}

interface Question {
  id: number
  questionTitle: string
  answers: Answer[]
}

export const questionsTest: Question[] = [
  {
    id: 1,
    questionTitle: 'Hãy chọn 1 ý đúng nhất với bản thân',
    answers: [
      {
        answer: 'Tôi không cảm thấy buồn ',
        point: 0.0
      },
      {
        answer: 'Nhiều lúc tôi cảm thấy chán hoặc buồn',
        point: 1.0
      },
      {
        answer: 'Lúc nào tôi cũng cảm thấy chán hoặc buồn và tôi không thể dừng lại được',
        point: 2.0
      },
      {
        answer: 'Lúc nào tôi cũng cảm thấy buồn và bất hạnh đến mức hoàn toàn đau khổ',
        point: 2.0
      },
      {
        answer: 'Tôi rất buồn hoặc rất bất hạnh và khổ sở đến mức không thể chịu được',
        point: 3.0
      }
    ]
  },
  {
    id: 2,
    questionTitle: 'Hãy chọn 1 ý đúng nhất với bản thân',
    answers: [
      {
        answer: 'Tôi hoàn toàn không bi quan và nản lòng về tương lai',
        point: 0.0
      },
      {
        answer: 'Tôi cảm thấy nản lòng về tương lai hơn trước đây',
        point: 1.0
      },
      {
        answer: 'Tôi cảm thấy mình chẳng có gì mong đợi ở tương lai cả',
        point: 2.0
      },
      {
        answer: 'Tôi cảm thấy sẽ không bao giờ khắc phục được những điều phiền muộn của tôi',
        point: 2.0
      },
      {
        answer:
          'Tôi cảm thấy tương lai tuyệt vọng và tình hình chỉ có thể tiếp tục xấu đi hoặc không thể cải thiện được',
        point: 3.0
      }
    ]
  },
  {
    id: 3,
    questionTitle: 'Hãy chọn 1 ý đúng nhất với bản thân',
    answers: [
      {
        answer: 'Tôi không cảm thấy như bị thất bại',
        point: 0.0
      },
      {
        answer: 'Tôi thấy mình thất bại nhiều hơn những người khác',
        point: 1.0
      },
      {
        answer: 'Tôi cảm thấy đã hoàn thành rất ít điều đáng giá hoặc đã hoàn thành rất ít điều có ý nghĩa',
        point: 2.0
      },
      {
        answer: 'Nhìn lại cuộc đời, tôi thấy mình đã có quá nhiều thất bại',
        point: 2.0
      },
      {
        answer: 'Tôi cảm thấy mình là một người hoàn toàn thất bại',
        point: 3.0
      },
      {
        answer: 'Tôi tự cảm thấy hoàn toàn thất bại trong vai trò của tôi (bố, mẹ, chồng, vợ…)',
        point: 3.0
      }
    ]
  },
  {
    id: 4,
    questionTitle: 'Hãy chọn 1 ý đúng nhất với bản thân',
    answers: [
      {
        answer: 'Tôi hoàn toàn không bất mãn',
        point: 0.0
      },
      {
        answer: 'Tôi còn thích thú với những điều mà trước đây tôi vẫn thường ưa thích',
        point: 0.0
      },
      {
        answer: 'Tôi luôn luôn cảm thấy buồn',
        point: 1.0
      },
      {
        answer: 'Tôi ít thấy thích những điều mà tôi vẫn thường ưa thích trước đây',
        point: 1.0
      },
      {
        answer: 'Tôi không thõa mãn về bất kỳ cái gì nữa',
        point: 2.0
      },
      {
        answer: 'Tôi rất ít thích thú về những điều trước đây tôi vẫn thường ưa thích',
        point: 2.0
      },
      {
        answer: 'Tôi không còn chút thích thú nào nữa',
        point: 3.0
      },
      {
        answer: 'Tôi không hài lòng với mọi cái',
        point: 3.0
      }
    ]
  },
  {
    id: 5,
    questionTitle: 'Hãy chọn 1 ý đúng nhất với bản thân',
    answers: [
      {
        answer: 'Tôi hoàn toàn không cảm thấy có tội lỗi gì ghê gớm cả',
        point: 0.0
      },
      {
        answer: 'Phần nhiều những việc tôi đã làm tôi đều cảm thấy có tội',
        point: 1.0
      },
      {
        answer: 'Phần lớn thời gian tôi cảm thấy mình tồi hoặc không xứng đáng',
        point: 1.0
      },
      {
        answer: 'Tôi cảm thấy mình hoàn toàn có tội',
        point: 2.0
      },
      {
        answer: 'Giờ đây tôi luôn cảm thấy trên thực tế mình tồi hoặc không xứng đáng',
        point: 2.0
      },
      {
        answer: 'Lúc nào tôi cũng cảm thấy mình có tội',
        point: 3.0
      },
      {
        answer: 'Tôi cảm thấy như là tôi rất tồi hoặc vô dụng',
        point: 3.0
      }
    ]
  },
  {
    id: 6,
    questionTitle: 'Hãy chọn 1 ý đúng nhất với bản thân',
    answers: [
      {
        answer: 'Tôi không cảm thấy đang bị trừng phạt',
        point: 0.0
      },
      {
        answer: 'Tôi cảm thấy có thể mình sẽ bị trừng phạt',
        point: 1.0
      },
      {
        answer: 'Tôi cảm thấy một cái gì xấu có thể đến với tôi',
        point: 1.0
      },
      {
        answer: 'Tôi mong chờ bị trừng phạt',
        point: 2.0
      },
      {
        answer: 'Tôi cảm thấy mình sẽ bị trừng phạt',
        point: 2.0
      },
      {
        answer: 'Tôi cảm thấy mình đang bị trừng phạt',
        point: 3.0
      },
      {
        answer: 'Tôi muốn bị trừng phạt',
        point: 3.0
      }
    ]
  },
  {
    id: 7,
    questionTitle: 'Hãy chọn 1 ý đúng nhất với bản thân',
    answers: [
      {
        answer: 'Tôi thấy bản thân mình vẫn như trước kia hoặc tôi không cảm thấy thất vọng với bản thân',
        point: 0.0
      },
      {
        answer: 'Tôi thất vọng với bản thân, tôi không còn tin tưởng vào bản thân hoặc tôi không thích bản thân',
        point: 1.0
      },
      {
        answer: 'Tôi thất vọng với bản thân hoặc tôi ghê tởm bản thân',
        point: 2.0
      },
      {
        answer: 'Tôi ghét bản thân mình hoặc tôi căm thù bản thân',
        point: 3.0
      }
    ]
  },
  {
    id: 8,
    questionTitle: 'Hãy chọn 1 ý đúng nhất với bản thân',
    answers: [
      {
        answer: 'Tôi không phê phán hoặc đổ lỗi cho bản thân hơn trước kia',
        point: 0.0
      },
      {
        answer: 'Tôi không tự cảm thấy một chút nào xấu hơn bất kể ai',
        point: 0.0
      },
      {
        answer: 'Tôi phê phán bản thân mình nhiều hơn trước kia',
        point: 1.0
      },
      {
        answer: 'Tôi tự chê mình về sự yếu đuối và lỗi lầm của bản thân',
        point: 1.0
      },
      {
        answer: 'Tôi phê phán bản thân về tất cả những lỗi lầm của mình',
        point: 2.0
      },
      {
        answer: 'Tôi khiển trách mình vì những lỗi lầm của bản thân',
        point: 2.0
      },
      {
        answer: 'Tôi đổ lỗi cho bản thân về tất cả mọi điều tồi tệ xảy ra',
        point: 3.0
      },
      {
        answer: 'Tôi khiển trách mình về mọi điều xấu xảy đến',
        point: 3.0
      }
    ]
  },
  {
    id: 9,
    questionTitle: 'Hãy chọn 1 ý đúng nhất với bản thân',
    answers: [
      {
        answer: 'Tôi không nghĩ đến việc tự tử',
        point: 0.0
      },
      {
        answer: 'Tôi nghĩ đến tự tử nhưng sẽ không làm điều đó',
        point: 1.0
      },
      {
        answer: 'Tôi muốn tự tử',
        point: 2.0
      },
      {
        answer: 'Tôi có kế hoạch thực hiện việc tự tử',
        point: 3.0
      },
      {
        answer: 'Tôi đã có dự định tự tử',
        point: 3.0
      }
    ]
  },
  {
    id: 10,
    questionTitle: 'Hãy chọn 1 ý đúng nhất với bản thân',
    answers: [
      {
        answer: 'Tôi không khóc nhiều hơn bình thường',
        point: 0.0
      },
      {
        answer: 'Tôi khóc nhiều hơn trước đây',
        point: 1.0
      },
      {
        answer: 'Tôi cảm thấy muốn khóc suốt thời gian và không thể dừng lại',
        point: 2.0
      },
      {
        answer: 'Tôi không còn khóc nữa ngay cả khi muốn khóc',
        point: 3.0
      }
    ]
  },
  {
    id: 11,
    questionTitle: 'Hãy chọn 1 ý đúng nhất với bản thân',
    answers: [
      {
        answer: 'Tôi không dễ bị kích động hơn trước kia',
        point: 0.0
      },
      {
        answer: 'Tôi bị kích động hoặc khó chịu dễ hơn trước kia',
        point: 1.0
      },
      {
        answer: 'Tôi bị kích động mọi lúc',
        point: 2.0
      },
      {
        answer: 'Tôi cảm thấy không dễ dàng bình tĩnh lại',
        point: 2.0
      },
      {
        answer: 'Tôi không bị kích động nhiều như trước kia',
        point: 3.0
      }
    ]
  },

  {
    id: 12,
    questionTitle: 'Hãy chọn 1 ý đúng nhất với bản thân',
    answers: [
      {
        answer: 'Tôi không mất hứng thú với người khác',
        point: 0.0
      },
      {
        answer: 'Tôi ít quan tâm đến người khác hơn trước đây',
        point: 1.0
      },
      {
        answer: 'Tôi mất hứng thú với việc giao tiếp với người khác',
        point: 2.0
      },
      {
        answer: 'Tôi hoàn toàn mất hứng thú với người khác',
        point: 3.0
      }
    ]
  },
  {
    id: 13,
    questionTitle: 'Hãy chọn 1 ý đúng nhất với bản thân',
    answers: [
      {
        answer: 'Tôi đưa ra quyết định tốt như mọi khi',
        point: 0.0
      },
      {
        answer: 'Tôi cố gắng trì hoãn khi đưa ra quyết định hơn trước đây',
        point: 1.0
      },
      {
        answer: 'Việc đưa ra quyết định trở nên khó khăn hơn nhiều đối với tôi',
        point: 2.0
      },
      {
        answer: 'Tôi không thể đưa ra bất kỳ quyết định nào nữa',
        point: 3.0
      }
    ]
  },
  {
    id: 14,
    questionTitle: 'Hãy chọn 1 ý đúng nhất với bản thân',
    answers: [
      {
        answer: 'Tôi không cảm thấy mình xấu xí hơn trước',
        point: 0.0
      },
      {
        answer: 'Tôi lo lắng rằng mình trông già đi hoặc kém hấp dẫn hơn',
        point: 1.0
      },
      {
        answer: 'Tôi cảm thấy mình ngày càng trở nên kém hấp dẫn',
        point: 2.0
      },
      {
        answer: 'Tôi tin rằng mình trông rất xấu xí',
        point: 3.0
      }
    ]
  },
  {
    id: 15,
    questionTitle: 'Hãy chọn 1 ý đúng nhất với bản thân',
    answers: [
      {
        answer: 'Tôi vẫn có thể làm việc tốt như trước đây',
        point: 0.0
      },
      {
        answer: 'Tôi cần thêm nỗ lực để bắt đầu làm một việc gì đó',
        point: 1.0
      },
      {
        answer: 'Tôi phải nỗ lực rất nhiều để làm bất kỳ việc gì',
        point: 2.0
      },
      {
        answer: 'Tôi không thể làm bất kỳ công việc nào',
        point: 3.0
      }
    ]
  },
  {
    id: 16,
    questionTitle: 'Hãy chọn 1 ý đúng nhất với bản thân',
    answers: [
      {
        answer: 'Tôi vẫn ngủ ngon như mọi khi',
        point: 0.0
      },
      {
        answer: 'Tôi ngủ không ngon giấc hơn trước',
        point: 1.0
      },
      {
        answer: 'Tôi thức dậy sớm hơn trước và không thể ngủ lại',
        point: 2.0
      },
      {
        answer: 'Tôi tỉnh giấc nhiều giờ trước khi muốn và không thể ngủ lại',
        point: 3.0
      }
    ]
  },
  {
    id: 17,
    questionTitle: 'Hãy chọn 1 ý đúng nhất với bản thân',
    answers: [
      {
        answer: 'Tôi không cảm thấy mệt mỏi hơn trước',
        point: 0.0
      },
      {
        answer: 'Tôi cảm thấy mệt mỏi hơn bình thường',
        point: 1.0
      },
      {
        answer: 'Tôi cảm thấy mệt mỏi gần như suốt thời gian',
        point: 2.0
      },
      {
        answer: 'Tôi cảm thấy mệt mỏi suốt thời gian và không thể làm được gì',
        point: 3.0
      }
    ]
  },
  {
    id: 18,
    questionTitle: 'Hãy chọn 1 ý đúng nhất với bản thân',
    answers: [
      {
        answer: 'Tôi không mất cảm giác thèm ăn',
        point: 0.0
      },
      {
        answer: 'Tôi không muốn ăn nhiều như trước',
        point: 1.0
      },
      {
        answer: 'Tôi ăn ít hơn rất nhiều so với trước đây',
        point: 2.0
      },
      {
        answer: 'Tôi không có chút thèm ăn nào nữa',
        point: 3.0
      }
    ]
  },
  {
    id: 19,
    questionTitle: 'Hãy chọn 1 ý đúng nhất với bản thân',
    answers: [
      {
        answer: 'Tôi không lo lắng về sức khỏe của mình hơn trước',
        point: 0.0
      },
      {
        answer: 'Tôi lo lắng về các vấn đề về thể chất như đau nhức, khó tiêu, hoặc táo bón nhiều hơn trước',
        point: 1.0
      },
      {
        answer: 'Tôi rất lo lắng về các vấn đề sức khỏe và khó nghĩ về bất cứ điều gì khác',
        point: 2.0
      },
      {
        answer: 'Tôi hoàn toàn bị ám ảnh bởi các vấn đề về thể chất',
        point: 3.0
      }
    ]
  },
  {
    id: 20,
    questionTitle: 'Hãy chọn 1 ý đúng nhất với bản thân',
    answers: [
      {
        answer: 'Gần đây tôi không nhận thấy có sự thay đổi nào trong sở thích của tôi với chuyện tình dục',
        point: 0.0
      },
      {
        answer: 'Tôi ít quan tâm đến chuyện tình dục hơn trước',
        point: 1.0
      },
      {
        answer: 'Tôi ít quan tâm đến chuyện tình dục hơn nhiều so với trước',
        point: 2.0
      },
      {
        answer: 'Tôi đã hoàn toàn mất hứng thú với chuyện tình dục',
        point: 3.0
      }
    ]
  },
  {
    id: 21,
    questionTitle: 'Hãy chọn 1 ý đúng nhất với bản thân',
    answers: [
      {
        answer: 'Tôi cảm thấy mọi chuyện không quá tệ như tưởng tượng',
        point: 0.0
      },
      {
        answer: 'Tôi thấy buồn vì những gì đang xảy ra',
        point: 1.0
      },
      {
        answer: 'Tôi buồn vì những điều xung quanh',
        point: 2.0
      },
      {
        answer: 'Tôi cảm thấy vô vọng và không còn niềm tin',
        point: 3.0
      }
    ]
  }
]
