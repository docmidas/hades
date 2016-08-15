statsArray = [{"state":"Alabama (01)","age_group":"< 1 year","icd":"P00-P04 (Newborn affected by maternal factors and by complications of pregnancy, labour and delivery)","gender":"Female","deaths":18,"population":28346},
{"state":"Alabama (01)","age_group":"< 1 year","icd":"P00-P04 (Newborn affected by maternal factors and by complications of pregnancy, labour and delivery)","gender":"Male","deaths":12,"population":29508},
{"state":"Alabama (01)","age_group":"< 1 year","icd":"P05-P08 (Disorders related to length of gestation and fetal growth)","gender":"Female","deaths":43,"population":28346},
{"state":"Alabama (01)","age_group":"< 1 year","icd":"P05-P08 (Disorders related to length of gestation and fetal growth)","gender":"Male","deaths":40,"population":29508},
{"state":"Alabama (01)","age_group":"< 1 year","icd":"P20-P29 (Respiratory and cardiovascular disorders specific to the perinatal period)","gender":"Female","deaths":26,"population":28346}];

statsArray.each do |stat|
  puts stat[:icd]
end
